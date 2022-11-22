import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChiusureReferenteComponent } from './chiusure-referente/chiusure-referente.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ChiusureReferenteComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChiusureReferenteRoutingModule { }
