import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChiusureReferenteRoutingModule } from './chiusure-referente-routing.module';
import { ChiusureReferenteComponent } from './chiusure-referente/chiusure-referente.component';
import { MaterialModule } from '../app.module';
import { UserPanelModule } from '../user-panel/user-panel.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StatoUtentiComponent } from './stato-utenti/stato-utenti.component';


@NgModule({
  declarations: [
    ChiusureReferenteComponent,
    StatoUtentiComponent
  ],
  imports: [
    CommonModule,
    ChiusureReferenteRoutingModule,
    MaterialModule,
    UserPanelModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ChiusureReferenteModule { }
