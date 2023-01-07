import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanRoutingModule } from './kanban-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BoardListComponent } from './board-list/board-list.component';
import { BoardComponent } from './board/board.component';
import { NewBoardDialogComponent } from './dialogs/new-board-dialog.component';
import { BoardDialogComponent } from './dialogs/board-dialog.component';
import { SharingDialogComponent } from './dialogs/sharing-dialog.component';


@NgModule({
  declarations: [
    BoardListComponent,
    BoardComponent,
    NewBoardDialogComponent,
    BoardDialogComponent,
    SharingDialogComponent
  ],
  imports: [
    CommonModule,
    KanbanRoutingModule,
    SharedModule,
    FormsModule,
    DragDropModule,
    ReactiveFormsModule,
  ],
})
export class KanbanModule { }
