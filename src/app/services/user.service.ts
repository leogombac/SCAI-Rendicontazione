import { HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, filter, map, ReplaySubject, switchMap, tap } from 'rxjs';
import { AziendeService, ReferenteService, CommesseService, UtenteService } from '../api/services';
import { Azienda, DatoOperativo, Diaria, User, UtenteAzienda } from '../models/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _utentiAzienda$ = new BehaviorSubject<UtenteAzienda[]>([]);
  utentiAzienda$ = this._utentiAzienda$.asObservable();

  private _diarie$ = new BehaviorSubject<Diaria[]>([]);
  diarie$ = this._diarie$.asObservable();

  private _modalitaLavoro$ = new BehaviorSubject<Diaria[]>([]);
  modalitaLavoro$ = this._modalitaLavoro$.asObservable();

  private _datoOperativo$ = new ReplaySubject<DatoOperativo>(1);
  datoOperativo$ = this._datoOperativo$.asObservable();

  private _user$ = new BehaviorSubject<User>(null);
  user$ = this._user$.asObservable();

  private _aziende$ = new BehaviorSubject<Azienda[]>([]);
  aziende$ = this._aziende$.asObservable();

  private _azienda$ = new BehaviorSubject<Azienda>(null);
  azienda$ = this._azienda$.asObservable();

  constructor(
    private utenteService: UtenteService,
    private aziendeService: AziendeService,
    private commesseService: CommesseService,
    private referenteService: ReferenteService,
    private authService: AuthService
  ) {
    this.createPipelineAziende();
    this.createPipelineDatiOperativi();
    this.createPipelineUtentiAzienda();
    this.createPipelineTrasferte();
    this.createPipelineModalitaLavoro();
  }

  get idReferente() {
    const user = this._user$.getValue();
    if (!user) return;
    return user.idReferente;
  }

  get idUtente() {
    const user = this._user$.getValue();
    if (!user) return;
    return user.idUtente;
  }

  set idUtente(idUtente: number) {
    const user = this._user$.getValue();
    if (!user) return;

    // Check to see if given idUtente exists in utentiAzienda
    const utentiAzienda = this._utentiAzienda$.getValue();
    if (idUtente !== this.idReferente && !utentiAzienda.some(utenteAzienda => utenteAzienda.idUtente === idUtente))
      return;

    user.idUtente = idUtente;
    this._user$.next(user);
  }

  // Trying next style of coding with these getters and setters
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
      .subscribe();
  }

  private createPipelineDatiOperativi() {

    combineLatest([
      this.authService.loginData$,
      this.azienda$
    ])
    .pipe(
      filter(([ loginData, azienda ]) => !!loginData && !!azienda),
      switchMap(([ loginData ]) =>
        this.utenteService.consuntivazioneUtenteIdUtenteDatiOperativiGet({ idUtente: +loginData.username.slice(-5) })
      ),
      map((d: any) => JSON.parse(d)),
      map(datiOperativi => datiOperativi.find(datoOperativo => datoOperativo.idAziendaAssunzione === this.azienda.idAzienda)),
      tap(datoOperativo => this._datoOperativo$.next(datoOperativo)),
      tap(datoOperativo => console.log("Dato Operativo", datoOperativo)),
      tap(datoOperativo => {
        const newUser = new User(datoOperativo);
        this._user$.next(newUser);
        console.log("User", newUser);
      }),
    )
    .subscribe();
  }

  private createPipelineUtentiAzienda() {

    combineLatest([
      this.user$,
      this.azienda$,
    ]).pipe(
      filter(([ user ]) => !!user && user.isReferente),
      switchMap(([ user, azienda ]) =>
        this.referenteService.consuntivazioneReferenteIdReferenteAziendaIdAziendaUtentiGet({ idReferente: user.idReferente, idAzienda: azienda.idAzienda })
      ),
      map((d: any) => JSON.parse(d)),
      tap(utentiAzienda => this._utentiAzienda$.next(utentiAzienda)),
      tap(utentiAzienda => console.log("Utenti Azienda", utentiAzienda)),
    )
    .subscribe();
  }

  private createPipelineTrasferte() {

    combineLatest([
      this.user$,
      this.azienda$,
    ]).pipe(
      filter(([ user ]) => !!user),
      switchMap(([ user, azienda ]) =>
        this.aziendeService.consuntivazioneAziendeIdAziendaUtenteIdUtenteTrasferteGet({
          idUtente: user.idUtente,
         idAzienda: azienda.idAzienda
        })
      ),
      map((d: any) => JSON.parse(d)),
      tap(diarie => this._diarie$.next(diarie)),
      tap(diarie => console.log("Diarie", diarie)),
    )
    .subscribe();
  }

  private createPipelineModalitaLavoro() {

    this.authService.loginData$
      .pipe(
        filter(loginData => !!loginData),
        switchMap(() =>
          this.commesseService.consuntivazioneCommessePresenzeTipiModalitaLavoroGet({ context: new HttpContext() })
        ),
        map((d: any) => JSON.parse(d)),
        tap(modalitaLavoro => this._modalitaLavoro$.next(modalitaLavoro)),
        tap(modalitaLavoro => console.log("Modalita Lavoro", modalitaLavoro)),
      )
      .subscribe();
  }

}
