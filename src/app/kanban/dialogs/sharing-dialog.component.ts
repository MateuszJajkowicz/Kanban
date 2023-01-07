import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Friend } from 'src/app/shared/models/user.model';
import { ProfileService } from 'src/app/shared/services/profile/profile.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-sharing-dialog',
  styleUrls: ['./sharing-dialog.component.scss'],
  template: `
    <mat-spinner class="spinner" *ngIf="isLoading"></mat-spinner>
    <!-- <mat-selection-list #shoes [multiple]="false">
      <mat-list-option *ngFor="let friend of friends" [value]="friend">
        <mat-card >
          <img matCardImage [src]="friend.photoURL" />
          <div class="friend-name">
            {{ friend.name }}
          </div>
        </mat-card>
      </mat-list-option>
    </mat-selection-list> -->
    <div class="outer-card">
      <div class="inner-card" *ngFor="let friend of friends" (click)="handleFriendSelection(friend)">
        <mat-card [class.highlight]="selectedFriend==friend">
          <img matCardImage [src]="friend.photoURL" />
          <div class="friend-name">
            {{ friend.name }}
          </div>
        </mat-card>
      </div>
    </div>
    <div mat-dialog-actions>
      <button mat-raised-button color="accent" [mat-dialog-close]="selectedFriend">
        Choose
      </button>
      <button mat-button (click)="onNoClick()">
        Cancel
      </button>
    </div>
  `,
})
export class SharingDialogComponent implements OnInit, OnDestroy {

  isLoading = true;
  sub: Subscription;
  friends: Friend[] = [];
  selectedFriend: Friend;

  constructor(public profileService: ProfileService, public dialogRef: MatDialogRef<SharingDialogComponent>) { }

  ngOnInit(): void {
    this.sub = this.profileService
      .getUserFriends()
      .subscribe(friends => { this.friends = friends[0].friends, this.isLoading = false });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleFriendSelection(value: Friend){
    this.selectedFriend = value;
  }
}
