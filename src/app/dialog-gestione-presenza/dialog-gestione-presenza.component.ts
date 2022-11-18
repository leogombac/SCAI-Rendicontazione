import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConsuntivoEvent } from 'src/app/models/rendicontazione';
import { CalendarService } from '../calendar/calendar.service';

@Component({
  selector: 'app-dialog-gestione-presenza',
  templateUrl: './dialog-gestione-presenza.component.html',
  styleUrls: ['./dialog-gestione-presenza.component.css']
})
export class DialogGestionePresenzaComponent implements OnInit {

  modalitaModifica: 'inizioDurata' | 'inizioFine' = 'inizioDurata';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { event: ConsuntivoEvent, events?: ConsuntivoEvent[] },
    private calendarService: CalendarService
  ) { }

  ngOnInit(): void {
  }

  delete() {

    // Delete local event
    if (this.data.event.isLocal) {
      const events = this.calendarService._consuntiviLocal$.getValue();
      const eventIndex = events.findIndex(event => event.id === this.data.event.id);
      events.splice(eventIndex, 1);
      this.calendarService._consuntiviLocal$
        .next(events);
    }
  }

}
