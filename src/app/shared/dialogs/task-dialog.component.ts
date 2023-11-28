import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BoardService } from '../services/board/board.service';
import { FormGroup, FormControl } from '@angular/forms';
import { TaskDialogData } from '../models/board.model';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { Moment } from 'moment';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MM YYYY',
  },
};

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./dialogs.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }]
})
export class TaskDialogComponent implements OnInit {
  labelOptions = ['purple', 'blue', 'green', 'yellow', 'red', 'gray'];
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  get getRangeStart(): FormControl<Date | Moment | null> {
    return this.range.get('start') as FormControl<Date | null>;
  }

  get getRangeEnd(): FormControl<Date | Moment | null> {
    return this.range.get('end') as FormControl<Date | null>;
  }

  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    private boardService: BoardService,
    @Inject(MAT_DIALOG_DATA) public data: TaskDialogData
  ) { }

  ngOnInit(): void {
    this.setValue();
  }

  setValue() {
    if (this.data.task.startDate && this.data.task.endDate) {
      this.range.setValue({
        start: this.data.task.startDate,
        end: this.data.task.endDate,
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleTaskDelete() {
    this.boardService.deleteTask(this.data.boardId, this.data.task);
    this.dialogRef.close();
  }

  handleRangeChange() {
    if (this.getRangeStart.value !== null) {
      if (Object.prototype.toString.call(this.getRangeStart.value) === '[object Date]') {
        this.data.task.startDate = (this.getRangeStart.value) as Date
      } else {

        this.data.task.startDate = ((this.getRangeStart.value) as Moment).toDate();
      }
    }
    if (this.getRangeEnd.value !== null) {
      if (Object.prototype.toString.call(this.getRangeEnd.value) === '[object Date]') {
        this.data.task.endDate = (this.getRangeEnd.value) as Date
      } else {
        this.data.task.endDate = ((this.getRangeEnd.value) as Moment).toDate();
      }
    }
  }
}
