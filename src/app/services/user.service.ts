import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, filter, map, ReplaySubject, share, switchMap, tap } from 'rxjs';
import { UtenteService } from '../api/services';
import { Azienda, DatiOperativi } from '../models/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _datiOperativi$ = new ReplaySubject<DatiOperativi>();
  datiOperativi$ = this._datiOperativi$.asObservable();

  private _aziende$ = new BehaviorSubject<Azienda[]>([]);
  aziende$ = this._aziende$.asObservable();

  private _azienda$ = new BehaviorSubject<Azienda>(null);
  azienda$ = this._azienda$.asObservable();

  constructor(
    private utenteService: UtenteService,
    private authService: AuthService
  ) {
    this.createPipelineAziende();
    this.createPipelineDatiOperativi();
  }

  get aziende() {
    return this._aziende$.getValue();
  }

  set aziende(aziende: Azienda[]) {
    this._aziende$.next(aziende);
  }

  get azienda() {
    return this._azienda$.getValue();
  }

  set azienda(azienda: Azienda) {
    this._azienda$.next(azienda);
  }

  private createPipelineAziende() {

    this.authService.loginData$
      .pipe(
        filter(loginData => !!loginData),
        switchMap(loginData =>
          this.utenteService.consuntivazioneUtenteIdUtenteAziendeGet({ idUtente: +loginData.username.slice(-4) })
        ),
        share(),
        map((d: any) => JSON.parse(d)),
        tap(aziende => this.aziende = aziende),
        tap(() => console.log("Aziende", this.aziende)),
        tap(() => {

          // If azienda is not yet select, then select it
          if (!this.azienda)
            this.azienda = this.aziende.find(azienda => !!azienda.idAziendaGruppoPreferita);
        }),
        tap(() => console.log("Selected azienda", this.azienda)),
      )
      .subscribe()
  }

  private createPipelineDatiOperativi() {

    combineLatest(
      this.authService.loginData$,
      this.azienda$
    )
    .pipe(
      filter(([ loginData, azienda ]) => !!loginData && !!azienda),
      switchMap(([ loginData ]) =>
        this.utenteService.consuntivazioneUtenteIdUtenteDatiOperativiGet({ idUtente: +loginData.username.slice(-5) })
          .pipe(
            map((d: any) => JSON.parse(d)[this.aziende.findIndex(_azienda => _azienda.idAzienda === this.azienda.idAzienda)])
          )
      ),
      tap(datiOperativi => this._datiOperativi$.next(datiOperativi)),
      tap(datiOperativi => console.log("Dati Operativi", datiOperativi)),
    )
    .subscribe();
  }

}
