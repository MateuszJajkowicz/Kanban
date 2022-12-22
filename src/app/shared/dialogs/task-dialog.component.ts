import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BoardService } from '../../services/board/board.service';
import { FormGroup, FormControl } from '@angular/forms';
import { toDate } from 'date-fns';

@Component({
  selector: 'app-task-dialog',
  styleUrls: ['./dialogs.component.scss'],
  template: `
    <h1 mat-dialog-title>Task</h1>
    <div mat-dialog-content class="content">
      <mat-form-field>
        <textarea
          placeholder="Task description"
          matInput
          [(ngModel)]="data.task.description"
          cdkFocusInitial
          cdkTextareaAutosize
        ></textarea>
      </mat-form-field>
      <mat-error *ngIf="!data.task.description">
        Task description is <strong>required</strong>
      </mat-error>

      <br/>
      <mat-form-field>
        <mat-label>Enter a date range</mat-label>
        <mat-date-range-input [formGroup]="range" [rangePicker]="rangePicker">
          <input matStartDate formControlName="start" placeholder="Start date" (dateChange)="handleRangeChange()">
          <input matEndDate formControlName="end" placeholder="End date" (dateChange)="handleRangeChange()">
        </mat-date-range-input>
        <mat-hint>DD/MM/YYYY - DD/MM/YYYY</mat-hint>
        <mat-datepicker-toggle matSuffix [for]="rangePicker"></mat-datepicker-toggle>
        <mat-date-range-picker #rangePicker>
          <mat-date-range-picker-actions>
            <button mat-button matDateRangePickerCancel>Cancel</button>
            <button mat-raised-button color="primary" matDateRangePickerApply>Apply</button>
          </mat-date-range-picker-actions>
        </mat-date-range-picker>
        <mat-error *ngIf="data.task.startDate == null">Invalid start date</mat-error>
        <mat-error *ngIf="data.task.endDate == null">Invalid end date</mat-error>
      </mat-form-field>
      <br/>
      <mat-button-toggle-group class="priority-toggle"
        #group="matButtonToggleGroup"
        [(ngModel)]="data.task.label"
      >
        <mat-button-toggle *ngFor="let opt of labelOptions" [value]="opt">
          <mat-icon [ngClass]="opt">{{
            opt === 'gray' ? 'check_circle' : 'lens'
          }}</mat-icon>
        </mat-button-toggle>
      </mat-button-toggle-group>
    </div>

    <div mat-dialog-actions>
      <button mat-raised-button color="accent" [mat-dialog-close]="data" [disabled]="!data.task.description">
        {{ data.isNew ? 'Add Task' : 'Update Task' }}
      </button>
      <button mat-button (click)="onNoClick()">
        Cancel
      </button>

      <app-delete-button
        (delete)="handleTaskDelete()"
        *ngIf="!data.isNew"
      ></app-delete-button>
    </div>
  `
})
export class TaskDialogComponent implements OnInit{
  labelOptions = ['purple', 'blue', 'green', 'yellow', 'red', 'gray'];
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  get getRangeStart(): any {
    return this.range.get('start')
  }

  get getRangeEnd(): any {
    return this.range.get('end')
  }

  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    private boardService: BoardService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.setValue();
  }

  setValue() {
    if (this.data.task.startDate && this.data.task.endDate) {
      if (this.data.isCalendar) {
        this.range.setValue({ start: toDate(this.data.task.startDate), end: toDate(this.data.task.endDate) });
      }
      else {
        this.range.setValue({ start: this.data.task.startDate.toDate(), end: this.data.task.endDate.toDate() });
      }
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
    if (this.getRangeStart.value != '') {
      this.data.task.startDate = this.getRangeStart.value;
    }
    if (this.getRangeStart.value != '') {
      this.data.task.endDate = this.getRangeEnd.value;
    }
  }
}
