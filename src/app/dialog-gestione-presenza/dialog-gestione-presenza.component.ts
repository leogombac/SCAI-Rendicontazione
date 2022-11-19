import { formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { event: ConsuntivoEvent, events?: ConsuntivoEvent[] },
    private calendarService: CalendarService,
    private rendicontazioneService: RendicontazioneService,
    private userService: UserService
  ) {}

  ngOnInit(): void {

    this.createSelectorLogic(
      'commessa',
      this.rendicontazioneService.commesse$,
      'codiceCommessa',
      this.data.event.codiceCommessa,
      [ Validators.required ]
    );
    this.createSelectorLogic(
      'diaria',
      this.userService.diarie$,
      'tipoTrasferta'
    );
    this.createSelectorLogic(
      'modalitaLavoro',
      this.userService.modalitaLavoro$,
      'descrizione',
      this.data.event.modalitaLavoro?.descrizione,
      [ Validators.required ]
    );

    const controlMap = {
      ...this.controlMap,
      dataInizio: new FormControl(this.data.event.start, [ Validators.required ]),
      numeroOre: new FormControl(this.data.event.durataOre, [
        Validators.required,
        Validators.min(0.5),
        Validators.max(14)
      ]),
      descrizione: new FormControl(this.data.event.note),
    };
    this.form = new FormGroup(controlMap);
  }

  private createSelectorLogic(controlName, observableArray, filterKey, defaultValue = '', validators = []) {

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
    
    this.controlMap[controlName] = new FormControl(defaultValue, [control => {
      const valueFound = this.optionSetMap[controlName].has(control.value);
      if (control.value === '' || valueFound)
        return null;
      else
        return { [controlName]: 'Non trovato' };
    }, ...validators]);

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

  delete() {

    // Delete local event
    if (this.data.event.isLocal) {
      const events = this.calendarService._consuntiviLocal$.getValue();
      const eventIndex = events.findIndex(event => event.id === this.data.event.id);
      events.splice(eventIndex, 1);
      this.calendarService._consuntiviLocal$
        .next(events);
      return;
    }

    // Delete remote event
    this.rendicontazioneService.deleteConsuntivo(this.data.event);
  }

}
