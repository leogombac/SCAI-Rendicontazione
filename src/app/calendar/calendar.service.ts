import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConsuntivoEvent } from '../models/consuntivo';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  _consuntiviLocal$ = new BehaviorSubject<ConsuntivoEvent[]>([]);

  constructor() { }
}
