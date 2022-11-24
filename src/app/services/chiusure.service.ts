import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, filter, lastValueFrom, map, share, switchMap } from 'rxjs';
import { ReferenteAziendaService } from '../api/referente/services';
import { ToastLevel } from '../models/toast';
import { ToasterService } from '../shared/toaster/toaster.service';
import { AppStateService } from './app-state.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ChiusureService {

  private _refresh$ = new BehaviorSubject<boolean>(true);
  refresh$ = this._refresh$.asObservable();

  constructor(
    private referenteAziendaService: ReferenteAziendaService,
    private appState: AppStateService,
    private userService: UserService,
    private toasterService: ToasterService
  ) { }

  refresh() {
    this._refresh$.next(true);
  }

  getChiusuraMese$() {
    return combineLatest([
      this.appState.viewIdUtente$,
      this.appState.viewIdAzienda$
    ])
    .pipe(
      filter(([ idUtente, idAzienda ]) => !!idUtente && !!idAzienda),
      switchMap(([ idUtente, idAzienda ]) =>
        this.referenteAziendaService.referenteIdUtenteAziendaIdAziendaConsuntivazioneAnnoMeseGet({
          idUtente,
          idAzienda: idAzienda,
          anno: this.appState.viewDate.getFullYear(),
          mese: this.appState.viewDate.getMonth() + 1
        }).pipe(
          map((d: any) => JSON.parse(d))
        )
      ),
      share(),
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
      )
    );
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
      this.appState.viewIdUtente$,
      this.appState.viewIdAzienda$
    ])
    .pipe(
      filter(([ idUtente, idAzienda ]) => !!idUtente && !!idAzienda),
      switchMap(([ idUtente, idAzienda ]) =>
        this.referenteAziendaService.referenteIdUtenteAziendaIdAziendaAnnoMeseStatoUtentiGet({
          idUtente: idUtente,
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
      share()
    );
  }

}
