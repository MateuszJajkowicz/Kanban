import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';
import { ProfileService } from 'src/app/shared/services/profile/profile.service';
import { SnackService } from 'src/app/shared/services/snack/snack.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  userData: User;
  sub: Subscription;
  sub2: Subscription;
  isLoading: boolean = true;
  myControl: FormControl = new FormControl();
  strangers: User[];
  isFriendsPage = false;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private profileService: ProfileService,
    private snackService: SnackService
  ) {}

  ngOnInit(): void {
    this.sub = this.profileService.getUserData().subscribe((data) => {
      (this.userData = data[0]), (this.isLoading = false);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  filter(val: string): (string | undefined)[] {
    return this.strangers
      .map((x) => x.name)
      .filter(
        (person) => person?.toLowerCase().indexOf(val.toLowerCase()) === 0
      );
  }

  logout() {
    this.afAuth.signOut();
    this.router.navigate(['/login']);
  }

  handleUpdate() {
    this.profileService.updateUserName(this.userData.uid, this.userData.name);
    this.snackService.success('Updated name succesfully');
  }

  handlePageChange() {
    this.isFriendsPage = true;
  }

  changePagetoProfile(value: boolean) {
    this.isFriendsPage = value;
  }
}
