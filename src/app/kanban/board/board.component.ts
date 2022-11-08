import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Task } from '../board.model';
import { BoardService } from '../board.service';
import { TaskDialogComponent } from '../dialogs/task-dialog.component';
import { BoardNameErrorStateMatcherService } from "../../services/board-name-error-state-matcher.service";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  @Input() board: any = [];
  @Output() taskMoved = new EventEmitter<{ previousContainer: string; newContainer: string }>();
  boardNameMatcher = new BoardNameErrorStateMatcherService();

  constructor(private boardService: BoardService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.setValue();
  }

  public formGroup = new FormGroup({
    boardNameFormControl: new FormControl('', [Validators.required])
  });

  get getboardNameFormControl(): any {
    return this.formGroup.get('boardNameFormControl')
  }

  setValue() {
    this.formGroup.setValue({boardNameFormControl: this.board.title});
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

  openDialog(task?: Task, idx?: number): void {
    const newTask = { label: 'purple' };
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
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

  handleDelete() {
    this.boardService.deleteBoard(this.board.id);
  }

  handleBoardNameChange() {
    if (this.getboardNameFormControl.value != '') {
      this.boardService.updateBoardName(this.board.id, this.getboardNameFormControl.value);
    }
  }
}
