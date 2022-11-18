import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { combineLatest, debounceTime, distinctUntilChanged, map, of, startWith, Subject, switchMap, takeUntil } from 'rxjs';
import { ConsuntivoEvent } from 'src/app/models/rendicontazione';
import { CalendarService } from '../calendar/calendar.service';
import { RendicontazioneService } from '../services/rendicontazione.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-dialog-gestione-presenza',
  templateUrl: './dialog-gestione-presenza.component.html',
  styleUrls: ['./dialog-gestione-presenza.component.css']
})
export class DialogGestionePresenzaComponent implements OnInit {

  modalitaModifica: 'inizioDurata' | 'inizioFine' = 'inizioDurata';

  destroy$ = new Subject<void>();

  filteredArrayMap = {};
  optionSetMap = {};
  controlMap = {};
  observableArrayMap = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { event: ConsuntivoEvent, events?: ConsuntivoEvent[] },
    private calendarService: CalendarService,
    private rendicontazioneService: RendicontazioneService,
    private userService: UserService
  ) {

    this.createSelectLogic(
      'commessa',
      this.rendicontazioneService.commesse$,
      'codiceCommessa'
    );

    this.createSelectLogic(
      'diaria',
      this.userService.diarie$,
      'tipoTrasferta'
    );

    this.createSelectLogic(
      'modalitaLavoro',
      this.userService.modalitaLavoro$,
      'descrizione'
    );
  }

  private createSelectLogic(controlName, observableArray, filterKey) {

    this.observableArrayMap[controlName] = observableArray;
    this.optionSetMap[controlName] = new Set();

    observableArray
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(array => {
        this.optionSetMap[controlName].clear();
        array.map(item => this.optionSetMap[controlName].add(item[filterKey].toString()));
      });
    
    this.controlMap[controlName] = new FormControl('', control => {
      const valueFound = this.optionSetMap[controlName].has(control.value);
      if (control.value === '' || valueFound)
        return null;
      else
        return { [controlName]: 'Non trovato' };
    });

    this.filteredArrayMap[controlName] = this.controlMap[controlName].valueChanges
      .pipe(
        startWith(''),
        debounceTime(100),
        distinctUntilChanged(),
        switchMap(value =>
          combineLatest([
            of(value),
            this.observableArrayMap[controlName]
          ])
        ),
        map(([value, array]) => 
          array.filter(item => item[filterKey].toString().toLowerCase().includes(value))
        ),
    );
  }

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
