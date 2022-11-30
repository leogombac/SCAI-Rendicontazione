import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, of, share, switchMap, tap } from 'rxjs';
import { Commessa, ConsuntivoEvent, ModalitaLavoro, SaveConsuntivoBody } from 'src/app/models/consuntivo';
import { CalendarService } from '../calendar/calendar.service';
import { Diaria } from '../models/user';
import { AppStateService } from '../services/app-state.service';
import { ConsuntivoService } from '../services/consuntivo.service';
import { UserService } from '../services/user.service';
import { createAutocompleteLogic, AutocompleteLogic } from '../utils/form.utils';
import { escapeRegExp } from '../utils/string.utils';
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

  numeroOreControl: FormControl;
  bancaOreControl: FormControl;
  straordDiurniControl: FormControl;
  straordNotturniControl: FormControl;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { event: ConsuntivoEvent, events?: ConsuntivoEvent[] },
    private dialog: MatDialogRef<DialogGestionePresenzaComponent>,
    public appState: AppStateService,
    private calendarService: CalendarService,
    private consuntivoService: ConsuntivoService,
    private userService: UserService
  ) {}

  ngOnInit() {

    const currDay = this.data.event.start.getDay();
    this.days[currDay][1] = true;

    const commesse$ = this.consuntivoService.getCommesse$(this.data.event.start);

    this.commessaAutocomplete = createAutocompleteLogic(
      'commessa',
      commesse$,
      'idAttivita',
      (item, value) => {
        if (typeof value === 'string')
          return new RegExp(escapeRegExp(value), 'i').test(item.descrizioneAttivita + ' ' + item.descrizioneCommessa);
        return item.idAttivita === value.idAttivita;
      },
      commesse$.pipe(
        map(commesse =>
          commesse.find(commessa => commessa.idAttivita === this.data.event.idAttivita)
        )
      ),
      [ Validators.required ]
    );

    const diarie$ = this.commessaAutocomplete.control.valueChanges
      .pipe(
        switchMap(commessa => {
          if (!commessa) return of([]);
          return this.userService.getDiarie(commessa.idAttivita);
        }),
        share()
      );

    // Diaria is bound to commessa valueChanges because of "se azienda.attivazioneDiaria==true  inserire nel get diaria l’id attività"
    this.diariaAutocomplete = createAutocompleteLogic(
      'diaria',
      diarie$,
      'idTipoTrasferta',
      (item, value) => {
        if (typeof value === 'string')
          return new RegExp(escapeRegExp(value), 'i').test(item.tipoTrasferta);
        return item.idTipoTrasferta === value.idTipoTrasferta;
      },
      diarie$.pipe(
        map(diarie => diarie.find(diaria => diaria.idTipoTrasferta === this.data.event.idTipoTrasferta))
      )
    );

    this.modalitaLavoroAutocomplete = createAutocompleteLogic(
      'modalitaLavoro',
      this.userService.modalitaLavoro$,
      'id',
      (item, value) => {
        if (typeof value === 'string')
          return new RegExp(escapeRegExp(value), 'i').test(item.descrizione);
        return item.id === value.id;
      },
      this.userService.modalitaLavoro$.pipe(
        map(modalitaLavoro =>
          modalitaLavoro.find(modalitaLavoro => modalitaLavoro.id === this.data.event.idModalitaLavoro)
        )
      )
    );

    this.numeroOreControl = new FormControl(
      this.data.event.hours,
      [
        Validators.required,
        Validators.min(0.5)
      ]
    );
    this.bancaOreControl = new FormControl(0);
    this.straordDiurniControl = new FormControl(0);
    this.straordNotturniControl = new FormControl(0);

    this.bancaOreControl.setValidators([
      (ctrl) => {
        if (ctrl.value <= this.numeroOreControl.value - this.straordDiurniControl.value - this.straordNotturniControl.value)
          return null;
        return { bancaOreExceed: "Banca ore eccede ore totali." }
      }
    ]);
    this.straordDiurniControl.setValidators([
      (ctrl) => {
        if (ctrl.value <= this.numeroOreControl.value - this.straordNotturniControl.value - this.bancaOreControl.value)
          return null;
        return { straordDiurniExceed: "Straord. diurni eccede ore totali." }
      }
    ]);
    this.straordNotturniControl.setValidators([
      (ctrl) => {
        if (ctrl.value <= this.numeroOreControl.value - this.straordDiurniControl.value - this.bancaOreControl.value)
          return null;
        return { straordNotturniExceed: "Straord. notturni eccede ore totali." }
      }
    ]);

    // Map controls to form
    this.form = new FormGroup({
      commessa: this.commessaAutocomplete.control,
      diaria: this.diariaAutocomplete.control,
      modalitaLavoro: this.modalitaLavoroAutocomplete.control,
      dataInizio: new FormControl(
        getTZOffsettedDate(this.data.event.start)
          .toISOString()
          .slice(0, 16), // Required because we saved timestamp without timezone and type of input is datetime-local
        [ Validators.required ]
      ),
      numeroOre: this.numeroOreControl,
      bancaOre: this.bancaOreControl,
      straordinariDiurni: this.straordDiurniControl,
      straordinariNotturni: this.straordNotturniControl,
      reperibilita: new FormControl(this.data.event.reperibilita),
      turni: new FormControl(this.data.event.turni),
      descrizione: new FormControl(this.data.event.note),
    });
  }

  displayFnCommessa(commessa: Commessa): string {
    if (!commessa) return '';
    return commessa.descrizioneCommessa
        && `${commessa.descrizioneAttivita} (${commessa.descrizioneCommessa})`;
  }

  displayFnDiaria(diaria: Diaria): string {
    if (!diaria) return '';
    return diaria.tipoTrasferta;
  }

  displayFnModalitaLavoro(modalitaLavoro: ModalitaLavoro): string {
    if (!modalitaLavoro) return '';
    return modalitaLavoro.descrizione;
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

    console.log('Form value', this.form.value);

    // Calculate minuti and fine
    const _dataInizio = getTZOffsettedDate(new Date(dataInizio));
    const inizio = _dataInizio.toISOString();
    const minuti = numeroOre * 60;
    const fine = new Date(_dataInizio.getTime() + minuti * 60 * 1000).toISOString();

    const consuntivo: SaveConsuntivoBody = {
      progressivo: 0, // Set below
      data: '', // Set below
      inizio,
      minuti,
      fine,
      inserimentoAutomatico: false,
      idAttivita: commessa.idAttivita,
      codiceAttivita: commessa.descrizioneAttivita,
      idCommessa: commessa.idCommessa,
      codiceCommessa: commessa.codiceCommessa,
      modalita: modalitaLavoro?.id,
      idTipoTrasferta: diaria?.idTipoTrasferta,
      reperibilita: false,
      turni: false,
      note: descrizione
    };

    console.log('SaveConsuntivoBody', consuntivo);

    // Create new
    if (this.data.event.isLocal) {
      consuntivo.progressivo = 0;
      consuntivo.data = inizio;
      this.data.event.idCommessa = commessa.idCommessa;
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
    consuntivo.dataPrecedente = this.data.event.originalStart;
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
