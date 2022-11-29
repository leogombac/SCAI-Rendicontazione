import { Component, OnInit } from '@angular/core';
import { debounceTime, map, Subject, takeUntil } from 'rxjs';
import { UtenteAzienda } from '../models/user';
import { AppStateService } from '../services/app-state.service';
import { UserService } from '../services/user.service';
import { AutocompleteLogic, createAutocompleteLogic } from '../utils/form.utils';
import { escapeRegExp } from '../utils/string.utils';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.css']
})
export class UserPanelComponent implements OnInit {

  utenteAziendaAutocomplete: AutocompleteLogic<UtenteAzienda>;
  
  destroy$ = new Subject<void>();

  constructor(
    private appState: AppStateService,
    public userService: UserService
  ) { }

  ngOnInit() {

    this.utenteAziendaAutocomplete = createAutocompleteLogic(
      'utenteAzienda',
      this.userService.utentiAzienda$.pipe(
        map(utentiAzienda => {
          const user = this.userService.user;

          // The user itself is not present in the list, therefore I manually insert him/her so that set-has validation works
          utentiAzienda = [
            {
              idUtente: user.idUtente,
              nome: user.nome,
              cognome: user.cognome
            },
            ...utentiAzienda
          ];
          return utentiAzienda;
        })
      ),
      'idUtente',
      (item, value) => {
        if (typeof value === 'string')
          return new RegExp(escapeRegExp(value), 'i').test(Object.values(item).join(' '));
        if (typeof value === 'object')
          return item.idUtente === value.idUtente;
      },
      this.appState.viewUser$
    );

    this.utenteAziendaAutocomplete.control.valueChanges
      .pipe(
        debounceTime(200),
        takeUntil(this.destroy$)
      )
      .subscribe(value => {

        // If value is empty string, then reset
        if (value === '')
          this.appState.viewIdUtente = this.userService.user.idUtente;

        // If value is any other string value, then return immediately
        if (typeof value !== 'object') return;

        // If viewIdUtente is different from value.idUtente, then update it
        if (this.appState.viewIdUtente !== value.idUtente)
          this.appState.viewIdUtente = value.idUtente;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  displayFnUtenteAzienda(utenteAzienda: UtenteAzienda): string {
    if (!utenteAzienda) return '';
    return utenteAzienda.nome
        && `${utenteAzienda.nome} ${utenteAzienda.cognome}`;
  }

}
