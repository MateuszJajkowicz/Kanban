import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore/';
import firebase from 'firebase/compat/app';
import { switchMap } from 'rxjs/operators';
import { Board, Task} from '../../models/board.model';
import { Friend } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) { }

  // Creates a new board for the current user
  async createBoard(data: Board, friendId?: string, sharedTask?: Task) {
    const user = await this.afAuth.currentUser;
    return this.db.collection('boards').add({
      ...data,
      uid: (friendId != undefined) ? friendId : user?.uid,
      tasks: (sharedTask != undefined) ? [sharedTask] : [{ taskId: this.db.createId(), description: 'Hello!', label: 'yellow'}]
    })
  }

  // Share task with friend
  shareTask(selectedFriend: Friend, task: Task) {
    this.createBoard({
      title: 'Shared Board',
      priority: 9999
    }, selectedFriend.uid, task);
  }

  // Delete board
  deleteBoard(boardId: string) {
    return this.db
      .collection('boards')
      .doc(boardId)
      .delete();
  }

  // Update board name
  updateBoardName(boardId: string, title: string) {
    return this.db
      .collection('boards')
      .doc(boardId)
      .update({ title });
  }

  // Update board
  updateTasks(boardId: string | undefined, tasks: Task[] | undefined) {
    return this.db
      .collection('boards')
      .doc(boardId)
      .update({ tasks });
  }

  // Move task to another board
  moveTask(
    previousBoardId: string,
    previousTasks: Task[] | undefined,
    newBoardId: string,
    newTasks: Task[] | undefined,
  ) {
    const db = firebase.firestore();
    const batch = db.batch();
    const previousRef = db.collection('boards').doc(previousBoardId);
    const nextRef = db.collection('boards').doc(newBoardId);
    batch.update(previousRef, { tasks: previousTasks });
    batch.update(nextRef, { tasks: newTasks });
    batch.commit().catch((err) => console.error(err));
  }

  // Delete task
  deleteTask(boardId: string, task: Task) {
    return this.db
      .collection('boards')
      .doc(boardId)
      .update({
        tasks: firebase.firestore.FieldValue.arrayRemove(task)
      });
  }

  // Get all users boards
  getUserBoards() {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.db
            .collection<Board>('boards', ref =>
              ref.where('uid', '==', user.uid).orderBy('priority')
            )
            .valueChanges({ idField: 'id' });
        }
        else {
          return [];
        }
      })
    )
  }

  // Run a batch write to change the priority of each board for sorting
  sortBoards(boards: Board[]) {
    const db = firebase.firestore();
    const batch = db.batch();
    const refs = boards.map(b => db.collection('boards').doc(b.id));
    refs.forEach((ref, idx) => batch.update(ref, { priority: idx }));
    batch.commit().catch((err) => console.error(err));;
  }
}
