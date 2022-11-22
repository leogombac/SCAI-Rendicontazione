import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, debounceTime, distinctUntilChanged, filter, map, Observable, of, startWith, Subject, switchMap, take, takeUntil } from 'rxjs';
import { UtenteAzienda } from '../models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.css']
})
export class UserPanelComponent implements OnInit {
  
  destroy$ = new Subject<void>();

  filteredOptions: Observable<UtenteAzienda[]>;
  optionSet = new Set<number>();
  myControl: FormControl;

  constructor(
    public userService: UserService
  ) {

    this.myControl = new FormControl('', control => {
      if (control.value === '' || this.optionSet.has(+control.value))
        return null;
      else
        return { utenteAzienda: 'Utente non trovato' };
    });

    this.userService.user$
      .pipe(
        filter(user => !!user),
        take(1)
      )
      .subscribe(user => this.myControl.setValue(user.idUtente));

    this.userService.utentiAzienda$
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(utentiAzienda => {
        this.optionSet.clear();
        utentiAzienda.map(utenteAzienda => this.optionSet.add(utenteAzienda.idUtente));
      });
  }

  ngOnInit() {

    this.myControl.valueChanges
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        if (!value)
          return this.userService.idUtente = this.userService.idReferente;
        if(this.myControl.valid)
          this.userService.idUtente = +value;
      });

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      debounceTime(100),
      distinctUntilChanged(),
      switchMap(value =>
        combineLatest([
          of(value),
          this.userService.utentiAzienda$
        ])
      ),
      map(([value, utentiAzienda]) =>
        utentiAzienda.filter(utenteAzienda => utenteAzienda.nome.includes(value) || utenteAzienda.cognome.includes(value) )
      ),
    );
  }

  getNomeCognome(users, idUtente) {
    const found = users.find(user => user.idUtente === idUtente);
    if (found)
      return found.nome + ' ' + found.cognome;
    return 'te stesso';
  }

}
