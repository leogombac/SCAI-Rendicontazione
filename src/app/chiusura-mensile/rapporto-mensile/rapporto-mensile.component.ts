import { Component, Input, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ChiusuraMese } from 'src/app/models/chiusure';
import { AppStateService } from 'src/app/services/app-state.service';
import { ChiusureService } from 'src/app/services/chiusure.service';
import { formatDate } from 'src/app/utils/time.utils';

@Component({
  selector: 'app-rapporto-mensile',
  templateUrl: './rapporto-mensile.component.html',
  styleUrls: ['./rapporto-mensile.component.css']
})
export class RapportoMensileComponent implements OnInit {

  formatDate = formatDate;

  @Input('chiusuraMese$') chiusuraMese$;

  constructor(
    public appState: AppStateService,
    public chiusureService: ChiusureService
  ) { }

  ngOnInit(): void { }

  closeDatePicker(eventDate: any, dp?: any) {
    this.appState.viewDate = eventDate;
    dp.close();
  }

  isChiusuraAlert(chiusuraMese: ChiusuraMese) {
    if (!chiusuraMese) return false;
    const [hh, mm] = chiusuraMese.totaleOreOrdinarie
                                 .split(':')
                                 .map(s => +s);
    const [hh2, mm2] = chiusuraMese.oreMensili
                                 .split(':')
                                 .map(s => +s);
    return hh+mm/60 != hh2+mm2/60;
  }

}

