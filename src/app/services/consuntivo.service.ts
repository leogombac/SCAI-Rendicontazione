import { Injectable } from '@angular/core';
import { isMonday, isSameMonth, previousMonday } from 'date-fns';
import { BehaviorSubject, combineLatest, distinctUntilChanged, filter, lastValueFrom, map, share, switchMap, tap } from 'rxjs';
import { CommesseService, UtenteService } from '../api/services';
import { CalendarService } from '../calendar/calendar.service';
import { ConsuntivoEvent, SaveConsuntivoBody } from '../models/consuntivo';
import { ToastLevel } from '../models/toast';
import { ToasterService } from '../shared/toaster/toaster.service';
import { getTZOffsettedDate } from '../utils/time.utils';
import { AppStateService } from './app-state.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ConsuntivoService {

  private lastDate = new Date(0);

  _consuntiviRemote$ = new BehaviorSubject<ConsuntivoEvent[]>([]);

  private _initialized$ = new BehaviorSubject<boolean>(false);
  initialized$ = this._initialized$.asObservable();

  private _loading$ = new BehaviorSubject<boolean>(false);
  loading$ = this._loading$.asObservable();

  private _refresh$ = new BehaviorSubject<boolean>(true);
  refresh$ = this._refresh$.asObservable();

  constructor(
    private utenteService: UtenteService,
    private commesseService: CommesseService,
    private appState: AppStateService,
    private userService: UserService,
    private calendarService: CalendarService,
    private toasterService: ToasterService
  ) {
    this.createPipelineRefresh();
    this.createPipelineConsuntivi();
  }

  // Pipeline to force refresh of consuntivi when lastDate and viewDate are of the same month
  private createPipelineRefresh() {
    combineLatest([
      this.userService.user$,
      this.appState.viewIdUtente$,
      this.refresh$
    ])
    .pipe(
      tap(() => this.lastDate = new Date(0))
    )
    .subscribe();
  }

  private createPipelineConsuntivi() {

    // Pipelline to clear consuntiviLocal$ on idUtente or idAzienda change
    combineLatest([
      this.appState.viewIdUtente$,
      this.appState.viewIdAzienda$
    ]).pipe(
        filter(([ idUtente, idAzienda ]) => !!idUtente && !!idAzienda),
        distinctUntilChanged(
          (x, y) => x[0] !== y[0] && x[1] !== y[1]
        ),
        tap(() =>
          this.calendarService._consuntiviLocal$.next([])
        )
      )
      .subscribe();

    combineLatest([
      this.appState.viewIdUtente$,
      this.appState.viewDate$,
      this.refresh$,
    ]).pipe(
      filter(([ idUtente, viewDate ]) => !!idUtente && !isSameMonth(this.lastDate, viewDate)),
      tap(([ idUtente, viewDate ]) => {
        this._loading$.next(true);
        this.lastDate = viewDate;
      }),
      switchMap(([ idUtente ]) =>
        this.utenteService.consuntivazioneUtenteIdUtentePresenzeIdAziendaAnnoMeseGiornoMeseGet({
          idUtente,
          idAzienda: this.appState.viewIdAzienda,
          anno: this.appState.viewDate.getFullYear(),
          mese: this.appState.viewDate.getMonth() + 1,
          giorno: this.appState.viewDate.getDate(),
        }).pipe(
          map((d: any) => JSON.parse(d))
        )
      ),
      map((response: any) => {

        this.appState.viewIdStato$.next(response.statoChiusura);

        return response.giorni.map(giorno =>
          new ConsuntivoEvent({
            presenza: {
              inizioMese: response.inizio,
              fineMese: response.fine,
              statoChiusura: response.statoChiusura,
              ...giorno
            }
          })
        )
      }),
      tap(consuntivi => {
        this._consuntiviRemote$.next(consuntivi);
        console.log('Consuntivi', consuntivi);
        this._loading$.next(false);
        this._initialized$.next(true);
      })
    )
    .subscribe();
  }

  refresh() {
    this._refresh$.next(true);
  }

  async saveConsuntivo(event: ConsuntivoEvent, saveConsuntivoBody: SaveConsuntivoBody) {

    const saveRequest = lastValueFrom(
      this.commesseService.consuntivazioneCommesseIdCommessaPresenzeUtenteIdUtentePost({
        idUtente: this.appState.viewIdUtente,
        body: saveConsuntivoBody,
        idCommessa: event.idCommessa
      })
    );

    try {
      await saveRequest;
      this.toasterService.addToast(ToastLevel.Success, "Consuntivo salvato con successo!");
      this.refresh();
    }
    catch (e) {
      this.toasterService.addToast(ToastLevel.Danger, "C'è stato un errore durante il salvataggio del consuntivo.");
    }
  }

  async saveConsuntivoRecursive(
    daysBitmap: boolean[],
    event: ConsuntivoEvent,
    saveConsuntivoBody: SaveConsuntivoBody
  ) {

    // Get monday of the week
    let monday;
    if (isMonday(event.start))
      monday = event.start;
    else
      monday = previousMonday(event.start);

    // Make an array of promises for parallel requests via Promise.all
    const promises = daysBitmap
      .map((day, index) => ({ day, index }))
      .filter(x => x.day)
      .map(({ day, index }) => {

        const yyyy = monday.getFullYear();
        const MM = monday.getMonth() + 1;
        const dd = monday.getDate() + (index + 6) % 7;
        const hh = ('' + event.start.getHours()).padStart(2, '0');
        const mm = ('' + event.start.getMinutes()).padStart(2, '0');

        const start = getTZOffsettedDate(new Date(`${yyyy}-${MM}-${dd}T${hh}:${mm}`));

        saveConsuntivoBody.data = start.toISOString();
        saveConsuntivoBody.inizio = saveConsuntivoBody.data;
        saveConsuntivoBody.fine = new Date(start.getTime() + saveConsuntivoBody.minuti * 60 * 1000).toISOString();

        return lastValueFrom(
          this.commesseService.consuntivazioneCommesseIdCommessaPresenzeUtenteIdUtentePost({
            idUtente: this.appState.viewIdUtente,
            body: saveConsuntivoBody,
            idCommessa: event.idCommessa
          })
        );
      });

      // Pluralize messages
      let successTxt;
      let errorTxt;
      if (promises.length > 1) {
        successTxt = 'Consuntivi salvati con successo!';
        errorTxt = "C'è stato un errore durante il salvataggio del consuntivo.";
      }
      else {
        successTxt = 'Consuntivo salvato con successo!';
        errorTxt = "C'è stato un errore durante il salvataggio di uno o più consuntivi.";
      }

      try {
        await Promise.all(promises);
        this.toasterService.addToast(ToastLevel.Success, successTxt);
        this.refresh();
      }
      catch (e) {
        this.toasterService.addToast(ToastLevel.Danger, errorTxt);
      }
  }

  async deleteConsuntivo(event: ConsuntivoEvent) {

    if (event.isLocal) return;
    
    const deleteRequest = lastValueFrom(
      this.commesseService.consuntivazioneCommesseIdCommessaPresenzeUtenteIdUtenteAnnoMeseGiornoIdAttivitaProgressivoDelete({
        idCommessa: event.idCommessa,
        idAttivita: event.idAttivita,
        progressivo: event.progressivo,
        idUtente: this.appState.viewIdUtente,
        anno: event.start.getFullYear(),
        mese: event.start.getMonth() + 1,
        giorno: event.start.getDate()
      })
    );

    try {
      await deleteRequest;
      this.toasterService.addToast(ToastLevel.Success, "Consuntivo eliminato con successo!");
      this.refresh();
    }
    catch (e) {
      this.toasterService.addToast(ToastLevel.Danger, "C'è stato un errore durante l'eliminazione del consuntivo.");
    }
  }

  getCommesse$(date: Date) {
    return this.utenteService.consuntivazioneUtenteIdUtenteCommesseIdAziendaAnnoMeseGiornoGet({
      idUtente: this.appState.viewIdUtente,
      idAzienda: this.appState.viewIdAzienda,
      anno: date.getFullYear(),
      mese: date.getMonth() + 1,
      giorno: date.getDate()
    })
    .pipe(
      share(),
      map((d: any) => JSON.parse(d)),
      map(_commesse => {
        const r = [..._commesse.utente, ..._commesse.obbligatorie];
        console.log('Commesse', r);
        return r;
      })
    );
  }
 
}
