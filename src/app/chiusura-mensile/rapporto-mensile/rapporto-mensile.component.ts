import { Component, Input, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AppStateService } from 'src/app/services/app-state.service';
import { ChiusureService } from 'src/app/services/chiusure.service';

@Component({
  selector: 'app-rapporto-mensile',
  templateUrl: './rapporto-mensile.component.html',
  styleUrls: ['./rapporto-mensile.component.css']
})
export class RapportoMensileComponent implements OnInit {

  @Input('chiusuraMese$') chiusuraMese$;

  selectedMonth$: Observable<number>;

  constructor(
    public appState: AppStateService,
    public chiusureService: ChiusureService
  ) { }

  ngOnInit(): void {
    this.selectedMonth$ = this.appState.viewDate$
      .pipe(
        map(date => date.getMonth())
      );
  }

  closeDatePicker(eventDate: any, dp?: any) {
    this.appState.viewDate = eventDate;
    dp.close();
  }

  formatDate(date: Date) {
    if (!date) return;
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
  }

}

