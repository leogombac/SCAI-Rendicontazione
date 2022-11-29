import { Injectable } from '@angular/core';
import { CalendarView } from 'angular-calendar';
import { BehaviorSubject } from 'rxjs';
import { AziendaDetail, User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  viewDate$ = new BehaviorSubject<Date>(new Date);
  viewMode$ = new BehaviorSubject<CalendarView.Month | CalendarView.Week | CalendarView.Day>(CalendarView.Month);
  viewIdStato$ = new BehaviorSubject<number>(1);

  viewIdUtente$ = new BehaviorSubject<number>(null);
  viewUser$ = new BehaviorSubject<User>(null);

  viewIdAzienda$ = new BehaviorSubject<number>(null);
  viewAzienda$ = new BehaviorSubject<AziendaDetail>(null);

  get viewDate() {
    return this.viewDate$.getValue();
  }

  set viewDate(date: Date) {
    this.viewDate$.next(date);
  }

  get viewMode() {
    return this.viewMode$.getValue();
  }

  set viewMode(mode) {
    this.viewMode$.next(mode);
  }

  get viewIdUtente() {
    return this.viewIdUtente$.getValue();
  }

  set viewIdUtente(id: number) {
    this.viewIdUtente$.next(id);
  }

  get viewUser() {
    return this.viewUser$.getValue();
  }

  get viewIdAzienda() {
    return this.viewIdAzienda$.getValue();
  }

  set viewIdAzienda(id: number) {
    this.viewIdAzienda$.next(id);
  }

  get viewAzienda() {
    return this.viewAzienda$.getValue();
  }

  get viewIdStato() {
    return this.viewIdStato$.getValue();
  }

  set viewIdStato(id: number) {
    this.viewIdStato$.next(id);
  }

  constructor() { }

}
