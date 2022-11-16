import { Injectable } from '@angular/core';
import { filter, map, Observable, ReplaySubject, switchMap, tap } from 'rxjs';
import { UtenteService } from '../api/services';
import { Azienda, DatiOperativi } from '../models/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  datiOperativi$: Observable<DatiOperativi>;
  aziende$: Observable<Azienda[]>
  _azienda$ = new ReplaySubject<Azienda>();
  azienda$ = this._azienda$.asObservable();

  constructor(
    private utenteService: UtenteService,
    private authService: AuthService
  ) {
    this.createPipelineDatiOperativi();
    this.createPipelineAziende();
  }

  selectAzienda(azienda: Azienda) {
    this._azienda$.next(azienda);
  }

  private createPipelineDatiOperativi() {

    this.datiOperativi$ = this.authService.loginData$
      .pipe(
        filter(loginData => !!loginData),
        switchMap(loginData =>
          this.utenteService.consuntivazioneUtenteIdUtenteDatiOperativiGet({ idUtente: +loginData.username.slice(-4) })
        ),
        map((d: any) => JSON.parse(d)[0]),
        tap(datiOperativi => console.log("Dati Operativi", datiOperativi))
      );
  }

  private createPipelineAziende() {

    this.aziende$ = this.authService.loginData$
      .pipe(
        filter(loginData => !!loginData),
        switchMap(loginData =>
          this.utenteService.consuntivazioneUtenteIdUtenteAziendeGet({ idUtente: +loginData.username.slice(-4) })
        ),
        map((d: any) => JSON.parse(d)),
        tap(aziende => this._azienda$.next(aziende[0])),
        tap(aziende => console.log("Aziende", aziende))
      );
  }

}
