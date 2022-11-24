import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, combineLatest, debounceTime, map, Observable, share, startWith, switchMap, tap } from 'rxjs';
import { StatoUtente } from 'src/app/models/chiusure';
import { ChiusureService } from 'src/app/services/chiusure.service';
import { createAutocompleteLogic } from 'src/app/utils/form.utils';

@Component({
  selector: 'app-stato-utenti',
  templateUrl: './stato-utenti.component.html',
  styleUrls: ['./stato-utenti.component.css']
})
export class StatoUtentiComponent implements OnInit {

  selectedDate = new Date();

  form: FormGroup;
  statoAutocomplete;
  contrattoAutocomplete;

  searchResults$: Observable<StatoUtente>;
  length = 0;

  paginator$ = new BehaviorSubject({
    pageIndex: 0,
    pageSize: 15
  });

  constructor(
    private chiusureService: ChiusureService
  ) { }

  ngOnInit(): void {

    const stati = [
      { id: 1, descr: 'Aperto' },
      { id: 2, descr: 'Chiuso' },
      { id: 3, descr: 'Vistato' }
    ];
    this.statoAutocomplete = createAutocompleteLogic(
      'stato',
      stati,
      'descr',
      (item, value) => new RegExp(value, 'i').test(item.descr.toString())
    );

    const contratti = [
      { id: 1, descr: 'Dipendente' },
      { id: 2, descr: 'Consulente' },
      { id: 3, descr: 'Stagista' },
      { id: 4, descr: 'Collaboratore a progetto' }
    ];
    this.contrattoAutocomplete = createAutocompleteLogic(
      'contratto',
      contratti,
      'descr',
      (item, value) => new RegExp(value, 'i').test(item.descr.toString())
    );

    // Map controls to form
    this.form = new FormGroup({
      'nome': new FormControl(''),
      'stato': this.statoAutocomplete.control,
      'contratto': this.contrattoAutocomplete.control,
      'straordinari': new FormControl(''),
      'trasferte': new FormControl('')
    });

    this.searchResults$ = combineLatest([
      this.form.valueChanges
        .pipe(
          startWith({ }),
          debounceTime(450)
        ),
      this.paginator$
    ])
    .pipe(
      switchMap(([ { nome, stato, contratto, straordinari, trasferte }, paginator ]) => {

        const idStato = stati.find(_stato => _stato.descr === stato)?.id;
        const idContratto = contratti.find(_contratto => _contratto.descr === contratto)?.id;

        return this.chiusureService.getStatoUtenti$(
          this.selectedDate,
          paginator.pageIndex,
          paginator.pageSize,
          nome,
          idStato,
          idContratto,
          straordinari,
          trasferte
        )
      }),
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
            _color
          };
        })
      ),
      share()
    );
  }

  onPageChange({ pageIndex, pageSize}) {
    this.paginator$.next({
      pageIndex,
      pageSize
    });
  }

  closeDatePicker(eventDate: any, dp?: any) {
    this.selectedDate = eventDate;
    dp.close();
  }

  formatDate() {
    if (!this.selectedDate) return;
    return this.selectedDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
  }

}
