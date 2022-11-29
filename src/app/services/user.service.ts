import { HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, filter, map, of, share, switchMap, tap } from 'rxjs';
import { AziendeService, ReferenteService, CommesseService, UtenteService } from '../api/services';
import { ModalitaLavoro } from '../models/consuntivo';
import { Azienda, Diaria, Festivita, User, UtenteAzienda } from '../models/user';
import { AuthService } from './auth.service';
import { AppStateService } from './app-state.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _user$ = new BehaviorSubject<User>(null);
  user$ = this._user$.asObservable();

  private _modalitaLavoro$ = new BehaviorSubject<ModalitaLavoro[]>([]);
  modalitaLavoro$ = this._modalitaLavoro$.asObservable();

  private _diarie$ = new BehaviorSubject<Diaria[]>([]);
  diarie$ = this._diarie$.asObservable();

  private _aziende$ = new BehaviorSubject<Azienda[]>([]);
  aziende$ = this._aziende$.asObservable();

  private _festivita$ = new BehaviorSubject<Festivita[]>([]);
  festivita$ = this._festivita$.asObservable();

  private _utentiAzienda$ = new BehaviorSubject<UtenteAzienda[]>([]);
  utentiAzienda$ = this._utentiAzienda$.asObservable();

  get user() {
    return this._user$.getValue();
  }

  get modalitaLavoro() {
    return this._modalitaLavoro$.getValue();
  }

  get festivita() {
    return this._festivita$.getValue();
  }

  constructor(
    private utenteService: UtenteService,
    private aziendeService: AziendeService,
    private commesseService: CommesseService,
    private referenteService: ReferenteService,
    private authService: AuthService,
    private appState: AppStateService
  ) {

    // These pipelines only need loginData
    this.createPipelineAziende();
    this.createPipelineModalitaLavoro();

    this.createPipelineAzienda();

    this.createPipelineUser();
    this.createPipelineViewUser();

    this.createPipelineFestivita();

    // This pipeline only ever emits if user is referente
    this.createPipelineUtentiAzienda();
  }

  getDiarie(idAttivita?: number) {
    return combineLatest([
      this.appState.viewIdUtente$,
      this.appState.viewAzienda$,
    ]).pipe(
      filter(([ idUtente, azienda ]) => !!idUtente && !!azienda),
      switchMap(([ idUtente, azienda ]) => {

        const pl: any = {
          idUtente,
          idAzienda: azienda.idAzienda,
        };

        // "se azienda.attivazioneDiaria==true  inserire nel get diaria l’id attività"
        if (azienda.attivazioneDiaria) {
          pl.idAttivita = idAttivita;
        }
        
        return this.aziendeService.consuntivazioneAziendeIdAziendaUtenteIdUtenteTrasferteGet(pl)
          .pipe(
            map((d: any) => JSON.parse(d))
          )
      }),
      share()
    );
  }

  private createPipelineAzienda() {
    this.appState.viewIdAzienda$
      .pipe(
        filter(idAzienda => !!idAzienda),
        switchMap(idAzienda =>
          this.aziendeService.consuntivazioneAziendeIdAziendaGet({
            idAzienda
          }).pipe(
            map((d: any) => JSON.parse(d))
          )
        ),
        tap(azienda => {
          this.appState.viewAzienda$.next(azienda);
          console.log("Azienda", azienda);
        })
      )
      .subscribe();
  }

  private createPipelineAziende() {
    this.authService.loginData$
      .pipe(
        filter(loginData => !!loginData),
        switchMap(loginData => 
          this.utenteService.consuntivazioneUtenteIdUtenteAziendeGet({
            idUtente: +loginData.username.slice(-4)
          }).pipe(
            map((d: any) => JSON.parse(d))
          )
        ),
        tap(aziende => {
          this._aziende$.next(aziende);
          console.log("Aziende", aziende);

          // Select default viewIdAzienda
          const defaultAzienda = aziende.find(azienda => !!azienda.idAziendaGruppoPreferita)
          this.appState.viewIdAzienda$.next(defaultAzienda.idAzienda);
          console.log("Default viewIdAzienda", defaultAzienda.idAzienda);
        })
      )
      .subscribe();
  }

  private createPipelineModalitaLavoro() {
    this.authService.loginData$
      .pipe(
        filter(loginData => !!loginData),
        switchMap(() =>
          this.commesseService.consuntivazioneCommessePresenzeTipiModalitaLavoroGet({
            context: new HttpContext()
          }).pipe(
            map((d: any) => JSON.parse(d))
          )
        ),
        tap(modalitaLavoro => {
          this._modalitaLavoro$.next(modalitaLavoro);
          console.log("Modalita Lavoro", modalitaLavoro);
        })
      )
      .subscribe();
  }

  private createPipelineUser() {
    combineLatest([
      this.authService.loginData$,
      this.appState.viewIdAzienda$
    ])
    .pipe(
      filter(([ loginData, idAzienda ]) => !!loginData && !!idAzienda),
      switchMap(([ loginData, idAzienda ]) =>
        combineLatest([
          this.utenteService.consuntivazioneUtenteIdUtenteDatiOperativiGet({
            idUtente: +loginData.username.slice(-5)
          }).pipe(
            map((d: any) => JSON.parse(d))
          ),
          of(idAzienda)
        ])
      ),
      map(([ datiOperativi, idAzienda ]) =>
        datiOperativi.find(datoOperativo => datoOperativo.idAziendaAssunzione === idAzienda)
      ),
      tap(datoOperativo => {
        const user = new User(datoOperativo);
        this._user$.next(user);
        console.log("User", user);

        // Select default viewIdUtente
        this.appState.viewIdUtente$.next(datoOperativo.idUtente);
        console.log("Default viewIdUtente", datoOperativo.idUtente);
      })
    )
    .subscribe();
  }

  private createPipelineViewUser() {
    combineLatest([
      this.appState.viewIdUtente$,
      this.appState.viewIdAzienda$
    ])
    .pipe(
      filter(([ idUtente, idAzienda ]) => !!idUtente && !!idAzienda),
      switchMap(([ idUtente, idAzienda ]) =>
        combineLatest([
          this.utenteService.consuntivazioneUtenteIdUtenteDatiOperativiGet({
            idUtente
          }).pipe(
            map((d: any) => JSON.parse(d))
          ),
          of(idAzienda)
        ])
      ),
      map(([ datiOperativi, idAzienda ]) =>
        datiOperativi.find(datoOperativo => datoOperativo.idAziendaAssunzione === idAzienda)
      ),
      tap(datoOperativo => {
        const user = new User(datoOperativo);
        this.appState.viewUser$.next(user);
        console.log("View user", user);
      })
    )
    .subscribe();
  }

  private createPipelineFestivita() {
    combineLatest([
      this.appState.viewIdUtente$,
      this.appState.viewIdAzienda$,
    ]).pipe(
      filter(([ idUtente, idAzienda ]) => !!idUtente && !!idAzienda),
      switchMap(([ idUtente, idAzienda ]) =>
        this.aziendeService.consuntivazioneAziendeIdAziendaUtenteIdUtenteFestivitaGet({
          idUtente,
          idAzienda
        }).pipe(
          map((d: any) => JSON.parse(d))
        )
      ),
      tap(festivita => {
        this._festivita$.next(festivita);
        console.log("Festività", festivita);
      })
    )
    .subscribe();
  }

  private createPipelineUtentiAzienda() {
    combineLatest([
      this.user$,
      this.appState.viewIdAzienda$,
    ]).pipe(
      filter(([ user, idAzienda ]) => !!user && user.isReferente && !!idAzienda),
      switchMap(([ user, idAzienda ]) =>
        this.referenteService.consuntivazioneReferenteIdReferenteAziendaIdAziendaUtentiGet({
          idReferente: user.idUtente,
          idAzienda
        }).pipe(
          map((d: any) => JSON.parse(d))
        )
      ),
      tap(utentiAzienda => {
        this._utentiAzienda$.next(utentiAzienda);
        console.log("Utenti Azienda", utentiAzienda);
      })
    )
    .subscribe();
  }
}
