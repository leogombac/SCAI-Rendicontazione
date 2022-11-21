import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { combineLatest, debounceTime, distinctUntilChanged, map, of, startWith, Subject, switchMap, takeUntil } from 'rxjs';
import { ConsuntivoEvent, SaveConsuntivoBody } from 'src/app/models/rendicontazione';
import { CalendarService } from '../calendar/calendar.service';
import { RendicontazioneService } from '../services/rendicontazione.service';
import { UserService } from '../services/user.service';
import { getTZOffsettedDate } from '../utils/time.utils';

@Component({
  selector: 'app-dialog-gestione-presenza',
  templateUrl: './dialog-gestione-presenza.component.html',
  styleUrls: ['./dialog-gestione-presenza.component.css']
})
export class DialogGestionePresenzaComponent implements OnInit {

  ripeti = false;
  days = [
    ["Domenica", false],
    ["Lunedì", false],
    ["Martedì", false],
    ["Mercoledì", false],
    ["Giovedì", false],
    ["Venerdì", false],
    ["Sabato", false]
  ];

  destroy$ = new Subject<void>();

  filteredArrayMap = {};
  optionSetMap = {};
  controlMap = {};
  observableArrayMap = {};

  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { event: ConsuntivoEvent, events?: ConsuntivoEvent[] },
    private dialog: MatDialogRef<DialogGestionePresenzaComponent>,
    private calendarService: CalendarService,
    private rendicontazioneService: RendicontazioneService,
    private userService: UserService
  ) {}

  ngOnInit(): void {

    const currDay = this.data.event.start.getDay();
    this.days[currDay][1] = true;

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
      dataInizio: new FormControl(
        getTZOffsettedDate(this.data.event.start)
          .toISOString()
          .slice(0, 16), // Required because we saved timestamp without timezone and type of input is datetime-local
        [ Validators.required ]
      ),
      numeroOre: new FormControl(
        this.data.event.durataOre, [
          Validators.required,
          Validators.min(0.5),
          Validators.max(14)
        ]
      ),
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

  async save() {

    // Extract field values
    const {
      commessa,
      dataInizio,
      descrizione,
      diaria,
      modalitaLavoro,
      numeroOre
    } = this.form.value;

    // Look for objects
    // TODO: fix codiceCommessa to idAttivita because of uniqueness
    const commessaObj = this.rendicontazioneService.commesse
      .find(c => c.codiceCommessa === commessa);

    const modalitaLavoroObj = this.userService.modalitaLavoro
    .find(mL => mL.descrizione === modalitaLavoro);

    const diariaObj = this.userService.diarie
      .find(d => d.tipoTrasferta === diaria);

    console.log('Commessa', commessaObj);
    console.log('Modalita Lavoro', modalitaLavoroObj);
    console.log('Diaria', diariaObj);

    // Calculate minuti and fine
    const _dataInizio = getTZOffsettedDate(new Date(dataInizio));
    const inizio = _dataInizio.toISOString();
    const minuti = numeroOre * 60;
    const fine = new Date(_dataInizio.getTime() + minuti * 60 * 1000).toISOString();

    console.log('Inizio', inizio, 'minuti', minuti, 'fine', fine);

    const consuntivo: SaveConsuntivoBody = {
      progressivo: 0, // Set below
      data: '', // Set below
      inizio,
      minuti,
      fine,
      inserimentoAutomatico: false,
      idAttivita: commessaObj.idAttivita,
      codiceAttivita: commessaObj.descrizioneAttivita,
      idCommessa: commessaObj.idCommessa,
      codiceCommessa: commessaObj.codiceCommessa,
      modalita: modalitaLavoro.workType,
      idTipoTrasferta: diaria?.idTipoTrasferta,
      reperibilita: false,
      turni: false,
      note: descrizione
    };

    // Create new
    if (this.data.event.isLocal) {
      consuntivo.progressivo = 0;
      consuntivo.data = inizio;
      this.data.event.idCommessa = commessaObj.idCommessa;
      try {
        await this.rendicontazioneService.saveConsuntivo(this.data.event, consuntivo);
        this.removeLocalEvent();
        this.dialog.close();
      }
      catch (e) { } // Error already handled at service level
      return;
    }

    // Update old
    consuntivo.progressivo = this.data.event.progressivo;
    consuntivo.data = this.data.event.originalStart;
    this.rendicontazioneService.saveConsuntivo(this.data.event, consuntivo);
    this.dialog.close();
  }

  delete() {

    // Delete local event
    if (this.data.event.isLocal) {
      return this.removeLocalEvent();
    }

    // Delete remote event
    this.rendicontazioneService.deleteConsuntivo(this.data.event);
  }

  private removeLocalEvent() {
    const events = this.calendarService._consuntiviLocal$.getValue();
    const eventIndex = events.findIndex(event => event.id === this.data.event.id);
    events.splice(eventIndex, 1);
    this.calendarService._consuntiviLocal$.next(events);
  }

}
