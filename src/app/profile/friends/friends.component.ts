import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Friend, User } from 'src/app/shared/models/user.model';
import { ProfileService } from 'src/app/shared/services/profile/profile.service';
import { map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit, OnDestroy {

  sub: Subscription;
  sub2: Subscription;
  isLoading = true;
  myControl: FormControl = new FormControl();
  filteredOptions: Observable<any[]>;
  strangers: User[];
  friends: Friend[] = [];
  @Input() userData: any = [];
  @Output() isFriendsPage = new EventEmitter<boolean>();

  constructor(public profileService: ProfileService) { }

  ngOnInit(): void {
    this.sub = this.profileService
      .getUserFriends()
      .subscribe(friends => this.friends = friends[0].friends);

    this.sub2 = this.profileService
      .getAllUsersData()
      .subscribe(allPeople => { this.getStrangers(allPeople), this.isLoading = false});

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(val => val.length >= 1 ? this.filter(val): [])
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.sub2.unsubscribe();
  }

  getStrangers(allPeople: User[]) {
    var strangersUid = this.getStrangersUid(allPeople);
    this.strangers = allPeople.filter(person =>
      strangersUid.includes(person.uid));
  }

  getStrangersUid(allPeople: User[]) {
    var allPeopleUidList: (string | undefined)[] = [];
    allPeople.forEach(person => {
      allPeopleUidList.push(person.uid);
    });
    var allFriendsUidList: (string | undefined)[] = [];
    this.friends?.forEach((friend => {
      allFriendsUidList.push(friend.uid);
    }))
    var strangersUidList = allPeopleUidList.filter(item => !allFriendsUidList.includes(item));
    return strangersUidList;
  }

  filter(val: string): (string|undefined)[] {
    return this.strangers.map(x => x.name).filter(person =>
      person?.toLowerCase().indexOf(val.toLowerCase()) === 0
    );
  }

  handleAddingAFriend() {
    var newfriend = this.strangers.map(person => { return <Friend>{ uid: person.uid, name: person.name, photoURL: person.photoURL }; })
      .filter(person => person.name == this.myControl.value);
    this.friends = (this.friends || []).concat(newfriend);
    this.profileService.addFriend(this.friends);
    this.myControl.setValue('');
  }

  handleFriendDelete(friend: Friend) {
    this.profileService.deleteFriend(this.userData.uid, friend);
  }

  changePageToProfile(value: boolean) {
    this.isFriendsPage.emit(value);
  }
}
