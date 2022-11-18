import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsuntiviRoutingModule } from './consuntivi-routing.module';
import { ConsuntiviComponent } from './consuntivi/consuntivi.component';
import { AppCalendarModule } from '../calendar/calendar.module';
import { RiepilogoComponent } from './riepilogo/riepilogo.component';
import { DialogGestionePresenzaComponent } from '../dialog-gestione-presenza/dialog-gestione-presenza.component';
import { MaterialModule } from '../app.module';
import { UserPanelModule } from '../user-panel/user-panel.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ConsuntiviComponent,
    RiepilogoComponent,
    DialogGestionePresenzaComponent
  ],
  imports: [
    CommonModule,
    ConsuntiviRoutingModule,
    AppCalendarModule,
    MaterialModule,
    UserPanelModule,
    FormsModule
  ]
})
export class ConsuntiviModule { }
