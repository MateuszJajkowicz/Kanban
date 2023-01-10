import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { GoogleAuthProvider } from 'firebase/auth';
import { User } from "../../models/user.model";
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User | null | undefined>;

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore, private router: Router) {
    // Get the auth state, then fetch the Firestore user document or return null
    this.user$ = this.afAuth.authState.pipe(
        switchMap(user => {
            // Logged in
          if (user) {
            return this.db.doc<User>(`users/${user.uid}`).valueChanges();
          } else {
            // Logged out
            return of(null);
          }
        })
      )
   }

  GoogleAuth() {
    return this.AuthLogin(new GoogleAuthProvider());
  }

  async AuthLogin(provider: GoogleAuthProvider) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        if (result.additionalUserInfo?.isNewUser) {
          this.createUserData(result.user);
        }
        this.router.navigate(['/', 'kanban']);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  private createUserData( user:any ) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.db.doc(`users/${user.uid}`);
    const friendsRef: AngularFirestoreDocument<User> = this.db.doc(`friends/${user.uid}`);
    const userData = {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL
    }
    const friendsData = {
      uid: user.uid,
    }
    return (userRef.set(userData, { merge: true }), friendsRef.set(friendsData, { merge: true }))
  }
}
