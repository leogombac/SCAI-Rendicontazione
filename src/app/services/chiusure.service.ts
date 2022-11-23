import { Injectable } from '@angular/core';
import { combineLatest, filter, map, share, switchMap } from 'rxjs';
import { ReferenteAziendaService } from '../api/referente/services';
import { AppStateService } from './app-state.service';

@Injectable({
  providedIn: 'root'
})
export class ChiusureService {

  constructor(
    private referenteAziendaService: ReferenteAziendaService,
    private appState: AppStateService
  ) { }

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
        share()
      );
  }
}
