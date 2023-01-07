import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { User, Friend } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ProfileService } from 'src/app/shared/services/profile/profile.service';
import { map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  userData: User;
  sub: Subscription;
  sub2: Subscription;
  isLoading: boolean = true;
  myControl: FormControl = new FormControl();
  filteredOptions: Observable<any[]>;
  strangers: User[];
  isFriendsPage = false;

  constructor(private router: Router, public afAuth: AngularFireAuth, public profileService: ProfileService) { }

  ngOnInit(): void {
    this.sub = this.profileService
      .getUserData()
      .subscribe(data => { this.userData = data[0], this.isLoading = false });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  filter(val: string): (string|undefined)[] {
    return this.strangers.map(x => x.name).filter(person =>
      person?.toLowerCase().indexOf(val.toLowerCase()) === 0
    );
  }

  logout() {
    this.afAuth.signOut();
    this.router.navigate(['/login']);
  }

  handleUpdate() {
    this.profileService.updateUserName(this.userData.uid, this.userData.name);
  }

  handlePageChange() {
    this.isFriendsPage = true;
  }

  changePagetoProfile(value: boolean) {
    this.isFriendsPage = value;
  }
}
