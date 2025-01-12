import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, filter, lastValueFrom, map, share, switchMap, tap } from 'rxjs';
import { ReferenteAziendaController2Service, ReferenteAziendaService } from '../api/referente/services';
import { ChiusuraMese } from '../models/chiusure';
import { ToastLevel } from '../models/toast';
import { ToasterService } from '../shared/toaster/toaster.service';
import { AppStateService } from './app-state.service';
import { ConsuntivoService } from './consuntivo.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ChiusureService {

  private _refresh$ = new BehaviorSubject<boolean>(true);
  refresh$ = this._refresh$.asObservable();

  private _chiusuraMese$ = new BehaviorSubject<ChiusuraMese>(null);
  chiusuraMese$ = this._chiusuraMese$.asObservable();

  private _chiusuraMeseLoading$ = new BehaviorSubject<boolean>(true);
  chiusuraMeseLoading$ = this._chiusuraMeseLoading$.asObservable();
  
  private _statoUtentiLoading$ = new BehaviorSubject<boolean>(true);
  statoUtentiLoading$ = this._statoUtentiLoading$.asObservable();

  constructor(
    private referenteAziendaService: ReferenteAziendaService,
    private referenteAziendaService2: ReferenteAziendaController2Service,
    private appState: AppStateService,
    private userService: UserService,
    private consuntivoService: ConsuntivoService,
    private toasterService: ToasterService
  ) {
    this.createPipelineChiusuraMese();
  }

  refresh() {
    this._refresh$.next(true);
  }

  async chiudiMese() {

    const chiudiReq = lastValueFrom(
      this.referenteAziendaService.referenteIdUtenteAziendaIdAziendaConsuntivazioneAnnoMeseStatoChiusuraStatoNuovoPost({
        idUtente: this.appState.viewIdUtente,
        idAzienda: this.appState.viewIdAzienda,
        anno: this.appState.viewDate.getFullYear(),
        mese: this.appState.viewDate.getMonth() + 1,
        statoNuovo: 2,
      })
    );

    try {
      await chiudiReq;
      this.toasterService.addToast(ToastLevel.Success, "Mese chiuso con successo!");
      this.refresh();
      this.consuntivoService.refresh();
    }
    catch (e) {
      this.toasterService.addToast(ToastLevel.Danger, "C'è stato un errore durante la chiusura del mese.");
    }
  }

  async apriMese() {

    const apriReq = lastValueFrom(
      this.referenteAziendaService.referenteIdUtenteAziendaIdAziendaConsuntivazioneAnnoMeseStatoChiusuraStatoNuovoPost({
        idUtente: this.appState.viewIdUtente,
        idAzienda: this.appState.viewIdAzienda,
        anno: this.appState.viewDate.getFullYear(),
        mese: this.appState.viewDate.getMonth() + 1,
        statoNuovo: 1,
      })
    );

    try {
      await apriReq;
      this.toasterService.addToast(ToastLevel.Success, "Mese aperto con successo!");
      this.refresh();
      this.consuntivoService.refresh();
    }
    catch (e) {
      this.toasterService.addToast(ToastLevel.Danger, "C'è stato un errore durante l'apertura del mese.");
    }
  }

  getStatoUtenti$(
    date: Date,
    pageIndex,
    pageSize,
    nome?,
    stato?,
    contratto?,
    straordinari?,
    trasferte?
  ) {
    return combineLatest([
      this.userService.user$,
      this.appState.viewIdAzienda$
    ])
    .pipe(
      filter(([ user, idAzienda ]) => !!user && !!idAzienda),
      tap(_ => this._statoUtentiLoading$.next(true)),
      switchMap(([ user, idAzienda ]) =>
        this.referenteAziendaService.referenteIdUtenteAziendaIdAziendaAnnoMeseStatoUtentiGet({
          idUtente: user.idUtente,
          idAzienda: idAzienda,
          anno: date.getFullYear(),
          mese: date.getMonth() + 1,
          Page: pageIndex,
          PageSize: pageSize,
          Nome: nome,
          Stato: stato,
          Tipo: contratto,
          Straordinari: straordinari,
          Trasferte: trasferte,
          AziendaPreferita: null,
          Skip: null,
          Recuperi: null
        }).pipe(
          map((d: any) => JSON.parse(d))
        )
      ),
      tap(_ => this._statoUtentiLoading$.next(false)),
      share()
    );
  }

  async vistaUtenti(idUtenti: number[]) {

    const apriReq = lastValueFrom(
      this.referenteAziendaService2.referenteAziendaIdAziendaConsuntivazioneAnnoMeseStatoChiusuraStatoNuovoPost({
        idAzienda: this.appState.viewIdAzienda,
        anno: this.appState.viewDate.getFullYear(),
        mese: this.appState.viewDate.getMonth() + 1,
        body: idUtenti,
        statoNuovo: 3,
      })
    );

    try {
      await apriReq;
      this.toasterService.addToast(ToastLevel.Success, "Utenti vistati con successo!");
      this.refresh();
    }
    catch (e) {
      this.toasterService.addToast(ToastLevel.Danger, "C'è stato un errore durante la vistatura degli utenti.");
    }
  }

  private createPipelineChiusuraMese() {
    combineLatest([
      this.appState.viewIdUtente$,
      this.appState.viewIdAzienda$,
      this.appState.viewDate$,
      this.refresh$
    ])
    .pipe(
      filter(([ idUtente, idAzienda, viewDate ]) => !!idUtente && !!idAzienda && !!viewDate),
      tap(_ => this._chiusuraMeseLoading$.next(true)),
      switchMap(([ idUtente, idAzienda, viewDate ]) =>
        this.referenteAziendaService.referenteIdUtenteAziendaIdAziendaConsuntivazioneAnnoMeseGet({
          idUtente,
          idAzienda: idAzienda,
          anno: viewDate.getFullYear(),
          mese: viewDate.getMonth() + 1
        }).pipe(
          map((d: any) => JSON.parse(d))
        )
      ),
      map(chiusura =>
        ({
          ...chiusura,
          presenzeGroupedByAttivita: chiusura.presenze.concatMap(presenza =>
            presenza.attivita.concatMap(attivita =>
              attivita.items.map(item =>
                ({
                  dataPresenza: presenza.dataPresenza,
                  idTipoModalitaLavoro: presenza.idTipoModalitaLavoro,
                  
                  codiceAttivita: attivita.codiceAttivita,
                  codiceCommessa: attivita.codiceCommessa,
                  codiceSottoCommessa: attivita.codiceSottoCommessa,
                  idAttivita: attivita.idAttivita,
                  idCommessa: attivita.idCommessa,
                  idSottoCommessa: attivita.idSottoCommessa,
                  
                  numeroMinuti: item.numeroMinuti,
                  turni: item.turni,
                  reperibilita: item.reperibilita,
                  progressivo: item.progressivo
                })  
              )
            )
          )
          .reduce(
            (a, b) =>
              (a[b.idAttivita]
                ? a[b.idAttivita].push(b)
                : a[b.idAttivita] = [b],
              a)
            ,
            {}
          )
        })
      ),
      tap(chiusuraMese => {
        this._chiusuraMese$.next(chiusuraMese);
        console.log('Chiusura Mese', chiusuraMese);
        this._chiusuraMeseLoading$.next(false);
      })
    )
    .subscribe();
  }

}
