import { Injectable } from '@angular/core';
import { CalendarView } from 'angular-calendar';
import { isMonday, previousMonday } from 'date-fns';
import { BehaviorSubject, combineLatest, distinctUntilChanged, filter, lastValueFrom, map, share, switchMap, tap } from 'rxjs';
import { CommesseService, UtenteService } from '../api/services';
import { CalendarService } from '../calendar/calendar.service';
import { ConsuntivoEvent, SaveConsuntivoBody } from '../models/consuntivo';
import { ToastLevel } from '../models/toast';
import { ToasterService } from '../shared/toaster/toaster.service';
import { getTZOffsettedDate } from '../utils/time.utils';
import { AppStateService } from './app-state.service';

@Injectable({
  providedIn: 'root'
})
export class ConsuntivoService {

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
    private calendarService: CalendarService,
    private toasterService: ToasterService
  ) {
    this.createPipelineConsuntivi();
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
      this.commesseService.consuntivazioneCommesseIdCommessaPresenzeUtenteIdUtenteAnnoMeseGiornoOreMinutiIdAttivitaProgressivoDelete({
        idCommessa: event.idCommessa,
        idAttivita: event.idAttivita,
        progressivo: event.progressivo,
        idUtente: this.appState.viewIdUtente,
        anno: event.originalStart.getFullYear(),
        mese: event.originalStart.getMonth() + 1,
        giorno: event.originalStart.getDate(),
        ore: event.originalStart.getHours(),
        minuti: event.originalStart.getMinutes()
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
      map((d: any) => JSON.parse(d)),
      map(_commesse => {
        const r = [..._commesse.utente, ..._commesse.obbligatorie];
        console.log('Commesse', r);
        return r;
      }),
      share()
    );
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
      this.appState.viewMode$,
      this.refresh$,
    ]).pipe(
      filter(([ idUtente ]) => !!idUtente),
      tap(() => this._loading$.next(true)),
      switchMap(([ idUtente, viewDate, viewMode ]) => {
        if (viewMode === CalendarView.Month)
          return this.utenteService.consuntivazioneUtenteIdUtentePresenzeIdAziendaAnnoMeseGiornoMeseGet({
            idUtente,
            idAzienda: this.appState.viewIdAzienda,
            anno: viewDate.getFullYear(),
            mese: viewDate.getMonth() + 1,
            giorno: viewDate.getDate(),
          });
        return this.utenteService.consuntivazioneUtenteIdUtentePresenzeIdAziendaAnnoMeseGiornoGet({
            idUtente,
            idAzienda: this.appState.viewIdAzienda,
            anno: viewDate.getFullYear(),
            mese: viewDate.getMonth() + 1,
            giorno: viewDate.getDate(),
          });
      }),
      map((responseText: any) => {

        const response = JSON.parse(responseText);

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
 
}
