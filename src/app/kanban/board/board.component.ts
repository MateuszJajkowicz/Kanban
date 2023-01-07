window.global = window
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Task } from '../../shared/models/board.model';
import { BoardService } from '../../shared/services/board/board.service';
import { TaskDialogComponent } from '../../shared/dialogs/task-dialog.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BoardDialogComponent } from '../dialogs/board-dialog.component';
import { SharingDialogComponent } from '../dialogs/sharing-dialog.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  isMobile: boolean
  sortOrder = ['purple', 'blue', 'green', 'yellow', 'red', 'grey'];
  @Input() board: any = [];
  @Output() taskMoved = new EventEmitter<{ previousContainer: string; newContainer: string }>();

  constructor(
    private deviceService: DeviceDetectorService,
    private boardService: BoardService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.deviceCheck();
  }

  deviceCheck() {
    this.isMobile = this.deviceService.isMobile();
  }

  taskDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        this.board.tasks,
        event.previousIndex,
        event.currentIndex
      );
      this.boardService.updateTasks(this.board.id, this.board.tasks);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.taskMoved.emit({
        previousContainer: event.previousContainer.id,
        newContainer: event.container.id,
      });
    }
  }

  openBoardDialog(boardTitle: string): void {
    const dialogRef = this.dialog.open(BoardDialogComponent, {
      width: '400px',
      data: { boardTitle }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
          this.boardService.updateBoardName(this.board.id, result);
        }
    });
  }

  openTaskDialog(task?: Task, idx?: number): void {
    var randomstring = require("randomstring");
    const newTask = { taskId: randomstring.generate(20), label: 'purple' };
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px',
      data: task
        ? { task: { ...task }, isNew: false, boardId: this.board.id, idx }
        : { task: newTask, isNew: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.isNew) {
          this.boardService.updateTasks(this.board.id, [
            ...this.board.tasks,
            result.task
          ]);
        } else {
          const update = this.board.tasks;
          update.splice(result.idx, 1, result.task);
          this.boardService.updateTasks(this.board.id, this.board.tasks);
        }
      }
    });
  }

  handleBoardDelete() {
    this.boardService.deleteBoard(this.board.id);
  }

  handleTaskDone(task: Task, idx: number) {
    task.label = 'gray';
    const update = this.board.tasks;
    update.splice(idx, 1, task);
    this.boardService.updateTasks(this.board.id, this.board.tasks);
  }

  handleTaskDelete(task: Task) {
    this.boardService.deleteTask(this.board.id, task);
  }

  handleSharingWithFriend(task: Task) {
    const dialogRef = this.dialog.open(SharingDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(selectedFriend => {
      if (selectedFriend) {
        console.log(task);
        console.log(selectedFriend);
        this.boardService.shareTask(selectedFriend, task);
      }
    });
  }

  filterByDate(asc = 1) {
    var tasksWithDate = this.board.tasks
      .filter((task: { startDate: any; endDate: any; }) => task.startDate != undefined && task.endDate != undefined)
      .sort((a: any, b: any) => (asc) * (a.startDate - b.startDate));
    var tasksWithoutDate = this.board.tasks
      .filter((task: { startDate: any; endDate: any; }) => task.startDate == undefined && task.endDate == undefined);
    this.board.tasks = [...tasksWithDate, ...tasksWithoutDate]
    this.boardService.updateTasks(this.board.id, this.board.tasks);
  }

  filterByPriority(asc = 1) {
    var tasks = this.board.tasks;
    tasks.sort((a: { label: string; }, b: { label: any; }) =>
      (asc) * (this.sortOrder.indexOf(a.label) - this.sortOrder.indexOf(b.label)));
    this.board.tasks = [...tasks]
    this.boardService.updateTasks(this.board.id, this.board.tasks);
  }
}
