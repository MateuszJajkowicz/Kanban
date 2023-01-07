import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-board-dialog',
  styleUrls: ['../../shared/dialogs/dialogs.component.scss'],
  template: `
    <h1 mat-dialog-title>Board</h1>
    <div mat-dialog-content>
      <p>What shall we call this board?</p>
      <mat-form-field>
        <textarea
          placeholder="Board title"
          matInput
          [(ngModel)]="data.title"
          cdkFocusInitial
          cdkTextareaAutosize
        ></textarea>
      </mat-form-field>
      <mat-error *ngIf="!data.title">
        Board title is <strong>required</strong>
      </mat-error>
    </div>
    <div mat-dialog-actions>
      <button mat-raised-button color="accent" [mat-dialog-close]="data.title" [disabled]="!data.title">
        Create
      </button>
      <button mat-button (click)="onNoClick()">
        Cancel
      </button>
    </div>
  `
})
export class NewBoardDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<NewBoardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
