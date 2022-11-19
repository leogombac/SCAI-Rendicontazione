import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, distinctUntilChanged, filter, map, share, switchMap, tap } from 'rxjs';
import { CommesseService, UtenteService } from '../api/services';
import { CalendarService } from '../calendar/calendar.service';
import { Commessa, ConsuntivoEvent, Presenza, SaveConsuntivoBody } from '../models/rendicontazione';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class RendicontazioneService {

  _consuntiviRemote$ = new BehaviorSubject<ConsuntivoEvent[]>([]);

  private _commesse$ = new BehaviorSubject<Commessa[]>([]);
  commesse$ = this._commesse$.asObservable();

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
    private calendarService: CalendarService
  ) {
    this.createPipelineConsultivi();
    this.createPipelineCommesse();
  }

  get commesse() {
    return this._commesse$.getValue();
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
    
    if (event.isLocal) return;

    this.commesseService.consuntivazioneCommesseIdCommessaPresenzeUtenteIdUtentePost({
      idUtente: this.userService.idUtente,
      body: saveConsuntivoBody,
      idCommessa: event.idCommessa
    })
    .subscribe(() => this.refresh());
  }

  async deleteConsuntivo(event: ConsuntivoEvent) {

    if (event.isLocal) return;
    
    this.commesseService.consuntivazioneCommesseIdCommessaPresenzeUtenteIdUtenteAnnoMeseGiornoIdAttivitaProgressivoDelete({
      idCommessa: event.idCommessa,
      idAttivita: event.idAttivita,
      progressivo: event.progressivo,
      idUtente: this.userService.idUtente,
      anno: event.start.getFullYear(),
      mese: event.start.getMonth() + 1,
      giorno: event.start.getDate()
    })
    .subscribe(() => this.refresh());
  }
  
  private getFakeHTTPCall() {
    return new Promise(resolve => setTimeout(() => resolve(true), 3000));
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
      filter(([ user ]) => !!user),
      tap(() => this._loading$.next(true)),
      switchMap(([ { idUtente } ]) =>
        this.utenteService.consuntivazioneUtenteIdUtentePresenzeIdAziendaAnnoMeseGiornoGet({
          idUtente,
          idAzienda: this.userService.azienda.idAzienda,
          anno: this.viewDate.getFullYear(),
          mese: this.viewDate.getMonth() + 1,
          giorno: this.viewDate.getDate(),
        })
      ),
      share(),
      map((d: any) => JSON.parse(d)),
      map(_consuntivi => {

        // Extract consuntivi from presenze response
        const consuntivi = [];
        _consuntivi.giorni.map(giorno =>
          giorno.presenze.map((presenza: Presenza) =>
            consuntivi.push(new ConsuntivoEvent({ dataPresenza: giorno.dataPresenza, presenza }))
          )
        )
        return consuntivi;

      }),
      tap(consuntivi => this._consuntiviRemote$.next(consuntivi)),
      tap(consuntivi => {
        this._loading$.next(false);
        this._initialized$.next(true);
        console.log('Consuntivi', consuntivi)
      }),
    )
    .subscribe();
  }

  private createPipelineCommesse() {
    
    combineLatest([
      this.userService.user$,
      this.viewDate$,
      this._update$, // TODO: if not necessary, then remove it
    ]).pipe(
      filter(([ user ]) => !!user),
      tap(() => this._loading$.next(true)),
      switchMap(([ { idUtente } ]) =>
        this.utenteService.consuntivazioneUtenteIdUtenteCommesseIdAziendaAnnoMeseGiornoGet({
          idUtente,
          idAzienda: this.userService.azienda.idAzienda,
          anno: this.viewDate.getFullYear(),
          mese: this.viewDate.getMonth() + 1,
          giorno: this.viewDate.getDate(),
        })
      ),
      share(),
      map((d: any) => JSON.parse(d)),
      map(_commesse => ([..._commesse.utente, ..._commesse.obbligatorie])),
      tap(commesse => this._commesse$.next(commesse)),
      tap(commesse => {
        console.log('Commesse', commesse)
      }),
    )
    .subscribe();
  }
}
