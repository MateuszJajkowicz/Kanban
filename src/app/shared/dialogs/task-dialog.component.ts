import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BoardService } from '../services/board/board.service';
import { FormGroup, FormControl } from '@angular/forms';
import { toDate } from 'date-fns';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./dialogs.component.scss'],
})
export class TaskDialogComponent implements OnInit {
  labelOptions = ['purple', 'blue', 'green', 'yellow', 'red', 'gray'];
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  get getRangeStart(): any {
    return this.range.get('start');
  }

  get getRangeEnd(): any {
    return this.range.get('end');
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
        this.range.setValue({
          start: toDate(this.data.task.startDate),
          end: toDate(this.data.task.endDate),
        });
      } else {
        this.range.setValue({
          start: this.data.task.startDate,
          end: this.data.task.endDate,
        });
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
    if (this.getRangeStart.value !== '') {
      this.data.task.startDate = this.getRangeStart.value;
    }
    if (this.getRangeEnd.value !== '') {
      this.data.task.endDate = this.getRangeEnd.value;
    }
  }
}
