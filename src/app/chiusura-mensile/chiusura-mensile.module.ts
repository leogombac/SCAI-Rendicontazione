import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChiusuraMensileRoutingModule } from './chiusura-mensile-routing.module';
import { ChiusuraMensileComponent } from './chiusura-mensile/chiusura-mensile.component';
import { UserPanelModule } from '../user-panel/user-panel.module';
import { RapportoMensileComponent } from './rapporto-mensile/rapporto-mensile.component';
import { MaterialModule } from '../app.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatiPresenzaComponent } from './dati-presenza/dati-presenza.component';


@NgModule({
  declarations: [
    ChiusuraMensileComponent,
    RapportoMensileComponent,
    DatiPresenzaComponent
  ],
  imports: [
    CommonModule,
    ChiusuraMensileRoutingModule,
    MaterialModule,
    UserPanelModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ChiusuraMensileModule { }
