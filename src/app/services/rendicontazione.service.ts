import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, share, switchMap, tap } from 'rxjs';
import { UtenteService } from '../api/services';
import { ConsuntivoEvent, Presenza } from '../models/rendicontazione';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class RendicontazioneService {

  private _consuntivi$ = new BehaviorSubject<ConsuntivoEvent[]>([]);
  consuntivi$ = this._consuntivi$.asObservable();

  private _viewDate$ = new BehaviorSubject<Date>(new Date());
  viewDate$ = this._viewDate$.asObservable();

  private _initialized$ = new BehaviorSubject<boolean>(false);
  initialized$ = this._initialized$.asObservable();
  private _loading$ = new BehaviorSubject<boolean>(false);
  loading$ = this._loading$.asObservable();
  private _update$ = new BehaviorSubject<boolean>(true);

  constructor(
    private utenteService: UtenteService,
    private userService: UserService,
  ) {
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

  async createConsuntivo(consuntivo: ConsuntivoEvent) {
    try {
      await this.getFakeHTTPCall();
      this.refresh();
    }
    catch(e) {
      throw new Error(e);
    }
  }

  async updateConsuntivo(consuntivo: ConsuntivoEvent) {
    try {
      await this.getFakeHTTPCall();
      this.refresh();
    }
    catch(e) {
      throw new Error(e);
    }
  }

  async deleteConsuntivo(consuntivo: ConsuntivoEvent) {
    try {
      await this.getFakeHTTPCall();
      this.refresh();
    }
    catch(e) {
      throw new Error(e);
    }
  }
  
  private getFakeHTTPCall() {
    return new Promise(resolve => setTimeout(() => resolve(true), 3000));
  }

  private createPipelineConsultivi() {

    combineLatest(
      this.userService.datiOperativi$,
      this.viewDate$,
      this._update$,
    ).pipe(
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
            consuntivi.push(new ConsuntivoEvent(giorno.dataPresenza, presenza))
          )
        )
        return consuntivi;

      }),
      tap(consuntivi => this._consuntivi$.next(consuntivi)),
      tap(consuntivi => {
        this._loading$.next(false);
        this._initialized$.next(true);
        console.log('Consuntivi', consuntivi)
      }),
    )
    .subscribe();
  }
}
