import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPanelComponent } from './user-panel.component';
import { MaterialModule } from '../app.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    UserPanelComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [
    UserPanelComponent
  ]
})
export class UserPanelModule { }
