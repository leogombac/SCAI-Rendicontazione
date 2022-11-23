import { Component, OnInit } from '@angular/core';
import { map, Subject, takeUntil } from 'rxjs';
import { UtenteAzienda } from '../models/user';
import { AppStateService } from '../services/app-state.service';
import { UserService } from '../services/user.service';
import { AutocompleteLogic, createAutocompleteLogic } from '../utils/form.utils';

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
          utentiAzienda.push({
            idUtente: user.idUtente,
            nome: 'Te',
            cognome: 'stesso'
          })
          return utentiAzienda;
        })
      ),
      'idUtente',
      (utenteAzienda, value) => utenteAzienda.nome.includes(value) || utenteAzienda.cognome.includes(value),
      this.appState.viewIdUtente$.pipe(
        map(idUtente => idUtente)
      )
    );

    this.utenteAziendaAutocomplete.control.valueChanges
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        if (!value)
          return this.appState.viewIdUtente = this.userService.user?.idUtente;
        if(this.utenteAziendaAutocomplete.control.valid)
          this.appState.viewIdUtente = +value;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  getNomeCognome() {
    const found = this.utenteAziendaAutocomplete.array
      .find(user => user.idUtente === this.appState.viewIdUtente);
    if (found)
      return found.nome + ' ' + found.cognome;
  }

}
