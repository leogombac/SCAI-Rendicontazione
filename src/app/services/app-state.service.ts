import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  viewIdUtente$ = new BehaviorSubject<number>(null);
  viewDate$ = new BehaviorSubject<Date>(new Date);
  viewIdAzienda$ = new BehaviorSubject<number>(null);

  get viewIdUtente() {
    return this.viewIdUtente$.getValue();
  }

  set viewIdUtente(id: number) {
    this.viewIdUtente$.next(id);
  }

  get viewDate() {
    return this.viewDate$.getValue();
  }

  set viewDate(date: Date) {
    this.viewDate$.next(date);
  }

  get viewIdAzienda() {
    return this.viewIdAzienda$.getValue();
  }

  set viewIdAzienda(id: number) {
    this.viewIdAzienda$.next(id);
  }

  constructor() { }

}
