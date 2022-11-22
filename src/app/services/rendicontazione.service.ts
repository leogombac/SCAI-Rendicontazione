import { Injectable } from '@angular/core';
import { isMonday, isSameMonth, previousMonday } from 'date-fns';
import { BehaviorSubject, combineLatest, distinctUntilChanged, filter, lastValueFrom, map, share, switchMap, tap } from 'rxjs';
import { CommesseService, UtenteService } from '../api/services';
import { CalendarService } from '../calendar/calendar.service';
import { ConsuntivoEvent, Presenza, SaveConsuntivoBody } from '../models/rendicontazione';
import { ToastLevel } from '../models/toast';
import { ToasterService } from '../shared/toaster/toaster.service';
import { getTZOffsettedDate } from '../utils/time.utils';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class RendicontazioneService {

  private lastDate = new Date(0);

  _consuntiviRemote$ = new BehaviorSubject<ConsuntivoEvent[]>([]);

  private _viewDate$ = new BehaviorSubject<Date>(new Date());
  viewDate$ = this._viewDate$.asObservable();

  private _initialized$ = new BehaviorSubject<boolean>(false);
  initialized$ = this._initialized$.asObservable();
  private _loading$ = new BehaviorSubject<boolean>(false);
  loading$ = this._loading$.asObservable();
  private _update$ = new BehaviorSubject<boolean>(true);

  constructor(
    private utenteService: UtenteService,
    private commesseService: CommesseService,
    private userService: UserService,
    private calendarService: CalendarService,
    private toasterService: ToasterService
  ) {
    this.createPipelineUpdate();
    this.createPipelineConsultivi();
  }

  get viewDate() {
    return this._viewDate$.getValue();
  }

  set viewDate(value: Date) {
    this._viewDate$.next(value);
  }

  refresh() {
    this._update$.next(true);
  }

  async saveConsuntivo(event: ConsuntivoEvent, saveConsuntivoBody: SaveConsuntivoBody) {

    const saveRequest = lastValueFrom(
      this.commesseService.consuntivazioneCommesseIdCommessaPresenzeUtenteIdUtentePost({
        idUtente: this.userService.idUtente,
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
            idUtente: this.userService.idUtente,
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
        idUtente: this.userService.idUtente,
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

  private createPipelineUpdate() {

    // This pipeline is used to force refresh of consuntivi when lastDate and viewDate are of the same month
    combineLatest([
      this.userService.user$,
      this._update$
    ])
    .pipe(
      tap(() =>
        this.lastDate = new Date(0)
      )
    )
    .subscribe();
  }

  private createPipelineConsultivi() {

    // Clear consuntiviLocal$ on idUtente or idAzienda change
    combineLatest([
      this.userService.user$,
      this.userService.azienda$
    ]).pipe(
        filter(([ user, azienda ]) => !!user && !!azienda),
        distinctUntilChanged(
          (x, y) => x[0].idUtente !== y[0].idUtente
                && x[1].idAzienda !== y[1].idAzienda
        ),
        tap(() => this.calendarService._consuntiviLocal$.next([]))
      )
      .subscribe();

    combineLatest([
      this.userService.user$,
      this.viewDate$,
      this._update$,
    ]).pipe(
      filter(([ user, viewDate ]) => !!user && !isSameMonth(this.lastDate, viewDate)),
      tap(([ user, viewDate ]) => {
        this._loading$.next(true);
        this.lastDate = viewDate;
      }),
      switchMap(([ { idUtente } ]) =>
        this.utenteService.consuntivazioneUtenteIdUtentePresenzeIdAziendaAnnoMeseGiornoMeseGet({
          idUtente,
          idAzienda: this.userService.azienda.idAzienda,
          anno: this.viewDate.getFullYear(),
          mese: this.viewDate.getMonth() + 1,
          giorno: this.viewDate.getDate(),
        })
      ),
      map((d: any) => JSON.parse(d)),
      map(_consuntivi => {

        // Extract consuntivi from presenze response
        const consuntivi = [];
        _consuntivi.giorni.map(giorno =>
          giorno.presenze.map((presenza: Presenza) =>
            consuntivi.push(new ConsuntivoEvent({ dataPresenza: giorno.dataPresenza, presenza }))
          )
        );
        return consuntivi;

      }),
      tap(consuntivi => this._consuntiviRemote$.next(consuntivi)),
      tap(consuntivi => {
        this._loading$.next(false);
        this._initialized$.next(true);
        console.log('Consuntivi', consuntivi);
      }),
    )
    .subscribe();
  }

  getCommesse$(date: Date) {
    return this.utenteService.consuntivazioneUtenteIdUtenteCommesseIdAziendaAnnoMeseGiornoGet({
      idUtente: this.userService.idUtente,
      idAzienda: this.userService.azienda.idAzienda,
      anno: date.getFullYear(),
      mese: date.getMonth() + 1,
      giorno: date.getDate(),
    })
    .pipe(
      share(),
      map((d: any) => JSON.parse(d)),
      map(_commesse => ([..._commesse.utente, ..._commesse.obbligatorie])),
      tap(commesse => console.log('Commesse', commesse)),
    );
  }
}
