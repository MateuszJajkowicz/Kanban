import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { User, Friend } from '../../models/user.model';
import { switchMap } from 'rxjs';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) { }

  createUserData(user: any) {
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

  async addFriend(data: Friend[]) {
    const user = await this.afAuth.currentUser;
    return this.db.collection<User>('friends')
      .doc(user?.uid)
      .update({
        friends: data,
      })
  }

  getAllUsersData() {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.db
            .collection<User>('users', ref =>
              ref.where('uid', '!=', user.uid)
            )
            .valueChanges({ idField: 'id' });
        }
        else {
          return [];
        }
      })
    )
  }

  getUserData() {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.db
            .collection<User>('users', ref =>
              ref.where('uid', '==', user.uid)
            )
            .valueChanges({ idField: 'id' });
        }
        else {
          return [];
        }
      })
    )
  }

  getUserFriends() {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.db
            .collection<any>('friends', ref =>
              ref.where('uid', '==', user.uid)
            )
            .valueChanges();
        }
        else {
          return [];
        }
      })
    )
  }

  updateUserName(userId?: string, name?: string) {
    return this.db
      .collection('users')
      .doc(userId)
      .update({ name });
  }

  deleteFriend(userId: string, friend: Friend) {
    return this.db
      .collection('friends')
      .doc(userId)
      .update({
        friends: firebase.firestore.FieldValue.arrayRemove(friend)
      });
  }
}
