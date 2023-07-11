import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BoardDialogData } from 'src/app/shared/models/board.model';

@Component({
  selector: 'app-board-dialog',
  styleUrls: ['../../shared/dialogs/dialogs.component.scss'],
  template: `
    <h1 mat-dialog-title>Board</h1>
    <div mat-dialog-content>
      <p>Want to change board name?</p>
      <mat-form-field>
        <textarea
          placeholder="Board title"
          matInput
          [(ngModel)]="data.boardTitle"
          cdkFocusInitial
          cdkTextareaAutosize
        ></textarea>
      </mat-form-field>
      <mat-error *ngIf="!data.boardTitle">
        Board title is <strong>required</strong>
      </mat-error>
    </div>
    <div mat-dialog-actions>
      <button
        mat-raised-button
        color="accent"
        [mat-dialog-close]="data.boardTitle"
        [disabled]="!data.boardTitle"
      >
        Change
      </button>
      <button mat-button (click)="onNoClick()">Cancel</button>
    </div>
  `,
})
export class BoardDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<BoardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BoardDialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
