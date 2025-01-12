import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/app.module';
import { CalendarComponent } from './calendar.component';
import { RefreshingHeaderComponent } from './utils/refreshing-header/refreshing-header.component';

@NgModule({
  imports: [
    CommonModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    MaterialModule
  ],
  declarations: [
    CalendarComponent,
    RefreshingHeaderComponent
  ],
  exports: [
    CalendarComponent,
    RefreshingHeaderComponent
  ],
})
export class AppCalendarModule {}
