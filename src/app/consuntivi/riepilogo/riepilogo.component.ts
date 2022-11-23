import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { combineLatest, map, Observable } from 'rxjs';
import { CalendarService } from 'src/app/calendar/calendar.service';
import { ConsuntivoEvent } from 'src/app/models/consuntivo';
import { ConsuntivoService } from 'src/app/services/consuntivo.service';
import { DialogGestionePresenzaComponent } from '../../dialog-gestione-presenza/dialog-gestione-presenza.component';

@Component({
  selector: 'app-riepilogo',
  templateUrl: './riepilogo.component.html',
  styleUrls: ['./riepilogo.component.css']
})
export class RiepilogoComponent implements OnInit {

  consuntivi$: Observable<ConsuntivoEvent[]>;

  constructor(
    public consuntivoService: ConsuntivoService,
    private calendarService: CalendarService,
    private dialog: MatDialog
  ) {
    this.consuntivi$ = combineLatest([
      this.consuntivoService._consuntiviRemote$,
      this.calendarService._consuntiviLocal$
    ])
    .pipe(
      map(([ remote, local ]) => [...remote, ...local].sort((a, b) => a.start - b.start))
    );
  }

  ngOnInit(): void {
  }

  openDialog(event: ConsuntivoEvent) {
    this.dialog.open(
      DialogGestionePresenzaComponent,
      {
        data: { event },
        width: '90%',
        maxWidth: '800px',
        enterAnimationDuration: '0ms',
        exitAnimationDuration: '0ms',
        autoFocus: false
      }
    );
  }

}
