import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsuntiviRoutingModule } from './consuntivi-routing.module';
import { ConsuntiviComponent } from './consuntivi/consuntivi.component';
import { AppCalendarModule } from '../calendar/calendar.module';
import { RiepilogoComponent } from './riepilogo/riepilogo.component';


@NgModule({
  declarations: [
    ConsuntiviComponent,
    RiepilogoComponent
  ],
  imports: [
    CommonModule,
    ConsuntiviRoutingModule,
    AppCalendarModule
  ]
})
export class ConsuntiviModule { }
