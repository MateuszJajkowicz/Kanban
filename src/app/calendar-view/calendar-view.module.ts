import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarRoutingModule } from './calendar-view-routing.module';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarHeaderComponent } from './calendar-header/calendar-header.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    CalendarComponent,
    CalendarHeaderComponent
  ],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    HttpClientModule,
    FormsModule,
    FlatpickrModule.forRoot(),
    MatDialogModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
  ],
  // providers: [
  //   HttpClient,
  // ]
})

export class CalendarViewModule { }
