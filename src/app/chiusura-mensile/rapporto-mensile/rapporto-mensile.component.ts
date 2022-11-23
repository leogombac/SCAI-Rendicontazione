import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AppStateService } from 'src/app/services/app-state.service';
import { ConsuntivoService } from 'src/app/services/consuntivo.service';

@Component({
  selector: 'app-rapporto-mensile',
  templateUrl: './rapporto-mensile.component.html',
  styleUrls: ['./rapporto-mensile.component.css']
})
export class RapportoMensileComponent implements OnInit {

  selectedMonth$: Observable<number>;

  constructor(
    public appState: AppStateService
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

