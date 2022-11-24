import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { AppStateService } from 'src/app/services/app-state.service';

@Component({
  selector: 'app-stato-utenti',
  templateUrl: './stato-utenti.component.html',
  styleUrls: ['./stato-utenti.component.css']
})
export class StatoUtentiComponent implements OnInit {

  selectedMonth$;

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
