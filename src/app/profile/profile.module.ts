import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from '../shared/shared.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FriendsComponent } from './friends/friends.component';

@NgModule({
  declarations: [
    ProfileComponent,
    FriendsComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    MatAutocompleteModule,
  ]
})
export class ProfileModule { }
