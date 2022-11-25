import { Component, Input, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
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

}

