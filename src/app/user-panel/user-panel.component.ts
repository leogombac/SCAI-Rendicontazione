import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, debounceTime, distinctUntilChanged, map, Observable, of, startWith, switchMap } from 'rxjs';
import { UtenteAzienda } from '../models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.css']
})
export class UserPanelComponent implements OnInit {
  
  filteredOptions: Observable<UtenteAzienda[]>;
  optionSet = new Set<number>();
  myControl = new FormControl('', control => {
    if (control.value === '' || this.optionSet.has(+control.value))
      return null;
    else
      return { utenteAzienda: 'Utente non trovato' };
  });
  

  constructor(
    public userService: UserService
  ) {

    this.userService.utentiAzienda$
      .subscribe(utentiAzienda => {
        this.optionSet.clear();
        utentiAzienda.map(utenteAzienda => this.optionSet.add(utenteAzienda.idUtente));
      });

    this.myControl.valueChanges
      .subscribe(value => {
        if (!value)
          return this.userService.idUtente = this.userService.idReferente;
        if(this.myControl.valid)
          this.userService.idUtente = +value;
      });
  }


  ngOnInit() {

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
        utentiAzienda.filter(utenteAzienda => utenteAzienda.nome.includes(value))
      ),
    );
  }

}
