import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChiusuraMensileComponent } from './chiusura-mensile/chiusura-mensile.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ChiusuraMensileComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChiusuraMensileRoutingModule { }
