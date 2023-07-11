import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Friend, User } from 'src/app/shared/models/user.model';
import { ProfileService } from 'src/app/shared/services/profile/profile.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-sharing-dialog',
  styleUrls: ['./sharing-dialog.component.scss'],
  template: `
    <mat-spinner class="spinner" *ngIf="isLoading"></mat-spinner>
    <div *ngIf="friends == undefined">
      <span
        >You don't have friends. In order to add friends visit your
        profile.</span
      >
    </div>
    <div class="outer-card" *ngIf="friends">
      <div
        class="inner-card"
        *ngFor="let friend of friends"
        (click)="handleFriendSelection(friend)"
      >
        <mat-card [class.highlight]="selectedFriend == friend">
          <img *ngIf="friend.photoURL" matCardImage [src]="friend.photoURL" />
          <div class="friend-name">
            {{ friend.name }}
          </div>
        </mat-card>
      </div>
    </div>
    <div mat-dialog-actions>
      <button
        mat-raised-button
        color="accent"
        [mat-dialog-close]="selectedFriend"
        [disabled]="!selectedFriend"
      >
        Choose
      </button>
      <button mat-button (click)="onNoClick()">Cancel</button>
    </div>
  `,
})
export class SharingDialogComponent implements OnInit, OnDestroy {
  isLoading = true;
  sub: Subscription;
  friends: User[] | undefined = [];
  selectedFriend: Friend;

  constructor(
    public profileService: ProfileService,
    public dialogRef: MatDialogRef<SharingDialogComponent>
  ) {}

  ngOnInit(): void {
    this.sub = this.profileService.getUserFriends().subscribe((friends) => {
      (this.friends = friends[0].friends), (this.isLoading = false);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleFriendSelection(value: Friend) {
    this.selectedFriend = value;
  }
}
