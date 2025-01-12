import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, debounceTime, map, Observable, of, share, startWith, switchMap, tap } from 'rxjs';
import { StatoUtente } from 'src/app/models/chiusure';
import { AppStateService } from 'src/app/services/app-state.service';
import { ChiusureService } from 'src/app/services/chiusure.service';
import { createAutocompleteLogic } from 'src/app/utils/form.utils';
import { escapeRegExp } from 'src/app/utils/string.utils';
import { formatDate } from 'src/app/utils/time.utils';

@Component({
  selector: 'app-stato-utenti',
  templateUrl: './stato-utenti.component.html',
  styleUrls: ['./stato-utenti.component.css']
})
export class StatoUtentiComponent implements OnInit {

  formatDate = formatDate;

  form: FormGroup;
  statoAutocomplete;
  contrattoAutocomplete;

  searchResults: StatoUtente[];
  searchResults$: Observable<StatoUtente>;
  length = 0;

  paginator$ = new BehaviorSubject({
    pageIndex: 0,
    pageSize: 15
  });

  constructor(
    private router: Router,
    public appState: AppStateService,
    public chiusureService: ChiusureService
  ) { }

  ngOnInit(): void {

    const stati = [
      { id: 1, descr: 'Aperto' },
      { id: 2, descr: 'Chiuso' },
      { id: 3, descr: 'Vistato' }
    ];
    this.statoAutocomplete = createAutocompleteLogic(
      'stato',
      of(stati),
      'id',
      (item, value) => {
        if (typeof value === 'string')
          return new RegExp(escapeRegExp(value), 'i').test(item.id);
        return item.id === value.id;
      }
    );

    const contratti = [
      { id: 1, descr: 'Dipendente' },
      { id: 2, descr: 'Consulente' },
      { id: 3, descr: 'Stagista' },
      { id: 4, descr: 'Collaboratore a progetto' }
    ];
    this.contrattoAutocomplete = createAutocompleteLogic(
      'contratto',
      of(contratti),
      'id',
      (item, value) => {
        if (typeof value === 'string')
          return new RegExp(escapeRegExp(value), 'i').test(item.id);
        return item.id === value.id;
      }
    );

    // Map controls to form
    this.form = new FormGroup({
      'nome': new FormControl(''),
      'stato': this.statoAutocomplete.control,
      'contratto': this.contrattoAutocomplete.control,
      'straordinari': new FormControl(''),
      'trasferte': new FormControl(''),
      'turni': new FormControl('')
    });

    this.searchResults$ = combineLatest([
      this.appState.viewDate$,
      this.paginator$,
      this.form.valueChanges
        .pipe(
          startWith({ }),
          debounceTime(200),
          tap(_ =>

            // Force page to zero when the user fiddles with the search card
            this.paginator$.next({
              ...this.paginator$.getValue(),
              pageIndex: 0
            })
          )
        )
    ])
    .pipe(
      switchMap(([ date, paginator, { nome, stato, contratto, straordinari, trasferte } ]) =>
        this.chiusureService.getStatoUtenti$(
          date,
          paginator.pageIndex,
          paginator.pageSize,
          nome,
          stato?.id,
          contratto?.id,
          straordinari,
          trasferte
        )
      ),
      share(),
      tap(response => this.length = response.totalItems),
      map(response => response.items),
      map(statiUtente => 
        statiUtente.map(statoUtente => {

          // Add progress
          const [hh, mm] = statoUtente.oreConsuntivate.split(':');
          const [hh2, mm2] = statoUtente.oreMensili.split(':');
          const percent = (hh*60 + mm*1) / (hh2*60 + mm2*1);
          const _progress = (100 * percent) + '%';
          const _color = 'hsl(' + Math.min(90 * percent, 100) + ', 100%, 50%)';

          return {
            ...statoUtente,
            _progress,
            _color,
            _selected: false
          };
        })
      ),
      tap(statiUtente => this.searchResults = statiUtente)
    );
  }

  displayFn(data: any): string {
    if (!data) return '';
    return data.descr;
  }

  onPageChange({ pageIndex, pageSize}) {
    this.paginator$.next({
      pageIndex,
      pageSize
    });
  }

  closeDatePicker(eventDate: any, dp?: any) {
    this.appState.viewDate = eventDate;
    dp.close();
  }

  goToChiusuraMensile(idUtente) {
    this.appState.viewIdUtente = idUtente;
    this.router.navigate(['/chiusura-mensile']);
  }

  selectAll() {
    this.searchResults
      .filter((x: any) => x.stato === 'Chiuso')
      .map((x: any) => x._selected = true);
  }

  disableVistaSelected() {
    if (!this.searchResults)
      return true;
    return !this.searchResults
      .filter((x: any) => x._selected)
      .length
  }

  vistaSelected() {
    const idUtenti = this.searchResults
      .filter((x: any) => x._selected)
      .map(x => x.idUtente);
    this.chiusureService.vistaUtenti(idUtenti);

    // Force refresh by resetting the viewDate to itself
    this.appState.viewDate = this.appState.viewDate;
  }

}
