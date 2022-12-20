import { Component, OnDestroy, OnInit } from '@angular/core';
import { Board } from '../board.model';
import { Subscription } from 'rxjs';
import { BoardService } from '../board.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { NewBoardDialogComponent } from '../dialogs/new-board-dialog.component';

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.scss']
})
export class BoardListComponent implements OnInit, OnDestroy {
  boards: Board[];
  sub: Subscription;
  isLoading: boolean = true;

  constructor(public boardService: BoardService, public dialog: MatDialog) { }

  ngOnInit() {
    this.sub = this.boardService
      .getUserBoards()
      .subscribe(boards => { this.boards = boards, this.isLoading = false });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.boards, event.previousIndex, event.currentIndex);
    this.boardService.sortBoards(this.boards);
  }

  taskMoved({ previousContainer, newContainer }: {previousContainer: any, newContainer: any}) {
    const previousTasks = this.boards.find((b) => b.id === previousContainer)?.tasks;
    const newTasks = this.boards.find((b) => b.id === newContainer)?.tasks;
    this.boardService.moveTask(previousContainer, previousTasks, newContainer, newTasks);
  }

  openNewBoardDialog(): void {
    const dialogRef = this.dialog.open(NewBoardDialogComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.boardService.createBoard({
          title: result,
          priority: this.boards.length
        })
      }
    })
  }

}
