import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsuntiviComponent } from './consuntivi/consuntivi.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ConsuntiviComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsuntiviRoutingModule { }
