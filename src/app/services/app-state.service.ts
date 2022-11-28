import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  viewDate$ = new BehaviorSubject<Date>(new Date);
  viewIdStato$ = new BehaviorSubject<number>(1);

  viewIdUtente$ = new BehaviorSubject<number>(null);
  viewIdAzienda$ = new BehaviorSubject<number>(null);
  viewUser$ = new BehaviorSubject<User>(null);

  get viewDate() {
    return this.viewDate$.getValue();
  }

  set viewDate(date: Date) {
    this.viewDate$.next(date);
  }

  get viewIdUtente() {
    return this.viewIdUtente$.getValue();
  }

  set viewIdUtente(id: number) {
    this.viewIdUtente$.next(id);
  }

  get viewIdAzienda() {
    return this.viewIdAzienda$.getValue();
  }

  set viewIdAzienda(id: number) {
    this.viewIdAzienda$.next(id);
  }

  get viewIdStato() {
    return this.viewIdStato$.getValue();
  }

  set viewIdStato(id: number) {
    this.viewIdStato$.next(id);
  }

  constructor() { }

}
