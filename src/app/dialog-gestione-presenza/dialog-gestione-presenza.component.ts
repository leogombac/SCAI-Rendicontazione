import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Commessa, ConsuntivoEvent, ModalitaLavoro, SaveConsuntivoBody } from 'src/app/models/consuntivo';
import { CalendarService } from '../calendar/calendar.service';
import { Diaria } from '../models/user';
import { ConsuntivoService } from '../services/consuntivo.service';
import { UserService } from '../services/user.service';
import { createAutocompleteLogic, AutocompleteLogic } from '../utils/form.utils';
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

  commessaAutocomplete: AutocompleteLogic<Commessa>;
  diariaAutocomplete: AutocompleteLogic<Diaria>;
  modalitaLavoroAutocomplete: AutocompleteLogic<ModalitaLavoro>;

  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { event: ConsuntivoEvent, events?: ConsuntivoEvent[] },
    private dialog: MatDialogRef<DialogGestionePresenzaComponent>,
    private calendarService: CalendarService,
    private consuntivoService: ConsuntivoService,
    private userService: UserService
  ) {}

  ngOnInit() {

    const currDay = this.data.event.start.getDay();
    this.days[currDay][1] = true;

    this.commessaAutocomplete = createAutocompleteLogic(
      'commessa',
      this.consuntivoService.getCommesse$(this.data.event.start),
      'codiceCommessa',
      (item, value) => new RegExp(value, 'i').test(item.codiceCommessa.toString()),
      this.data.event.codiceCommessa,
      [ Validators.required ]
    );

    this.diariaAutocomplete = createAutocompleteLogic(
      'diaria',
      this.userService.diarie$,
      'tipoTrasferta',
      (item, value) => new RegExp(value, 'i').test(item.tipoTrasferta.toString()),
    );

    this.modalitaLavoroAutocomplete = createAutocompleteLogic(
      'modalitaLavoro',
      this.userService.modalitaLavoro$,
      'descrizione',
      (item, value) => new RegExp(value, 'i').test(item.descrizione.toString()),
      this.data.event.modalitaLavoro?.descrizione,
      [ Validators.required ]
    );

    // Map controls to form
    this.form = new FormGroup({
      'commessa': this.commessaAutocomplete.control,
      'diaria': this.diariaAutocomplete.control,
      'modalitaLavoro': this.modalitaLavoroAutocomplete.control,
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
    });
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
    const commessaObj = this.commessaAutocomplete.array
      .find(c => c.codiceCommessa === commessa);

    const diariaObj = this.diariaAutocomplete.array
      .find(d => d.tipoTrasferta === diaria);

    const modalitaLavoroObj = this.modalitaLavoroAutocomplete.array
      .find(mL => mL.descrizione === modalitaLavoro);

    console.log('Commessa', commessaObj);
    console.log('Diaria', diariaObj);
    console.log('Modalita Lavoro', modalitaLavoroObj);

    // Calculate minuti and fine
    const _dataInizio = getTZOffsettedDate(new Date(dataInizio));
    const inizio = _dataInizio.toISOString();
    const minuti = numeroOre * 60;
    const fine = new Date(_dataInizio.getTime() + minuti * 60 * 1000).toISOString();

    const consuntivo: SaveConsuntivoBody = {
      progressivo: 0, // Set below
      dataPrecedente: '', // Set below
      data: '', // Set below
      inizio,
      minuti,
      fine,
      inserimentoAutomatico: false,
      idAttivita: commessaObj.idAttivita,
      codiceAttivita: commessaObj.descrizioneAttivita,
      idCommessa: commessaObj.idCommessa,
      codiceCommessa: commessaObj.codiceCommessa,
      modalita: modalitaLavoroObj.id,
      idTipoTrasferta: diariaObj?.idTipoTrasferta,
      reperibilita: false,
      turni: false,
      note: descrizione
    };

    console.log('SaveConsuntivoBody', consuntivo);

    // Create new
    if (this.data.event.isLocal) {
      consuntivo.progressivo = 0;
      consuntivo.data = inizio;
      this.data.event.idCommessa = commessaObj.idCommessa;
      try {
        await this.consuntivoService.saveConsuntivoRecursive(
          this.days.map((x: any) => x[1]),
          this.data.event,
          consuntivo
        );
        this.removeLocalEvent();
        this.dialog.close();
      }
      catch (e) { } // Error already handled at service level
      return;
    }

    // Update old
    consuntivo.progressivo = this.data.event.progressivo;
    consuntivo.dataPrecedente = this.data.event.start;
    consuntivo.data = inizio;
    this.consuntivoService.saveConsuntivo(this.data.event, consuntivo);
    this.dialog.close();
  }

  delete() {

    // Delete local event
    if (this.data.event.isLocal) {
      return this.removeLocalEvent();
    }

    // Delete remote event
    this.consuntivoService.deleteConsuntivo(this.data.event);
  }

  private removeLocalEvent() {
    const events = this.calendarService._consuntiviLocal$.getValue();
    const eventIndex = events.findIndex(event => event.id === this.data.event.id);
    events.splice(eventIndex, 1);
    this.calendarService._consuntiviLocal$.next(events);
  }

}
