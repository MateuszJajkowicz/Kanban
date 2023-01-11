import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { GoogleAuthProvider } from 'firebase/auth';
import { User } from "../../models/user.model";
import { Observable } from 'rxjs';
import { ProfileService } from '../profile/profile.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User | null | undefined>;

  constructor(
    private afAuth: AngularFireAuth,
    private profileService: ProfileService,
    private router: Router) {
   }

  GoogleAuth() {
    return this.AuthLogin(new GoogleAuthProvider());
  }

  async AuthLogin(provider: GoogleAuthProvider) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        if (result.additionalUserInfo?.isNewUser) {
          this.profileService.createUserData(result.user)
        }
        this.router.navigate(['/', 'kanban']);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
