import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { isSameDay, isSameMonth } from 'date-fns';
import { Subject, Subscription } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
  DAYS_OF_WEEK,
} from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { BoardService } from '../../shared/services/board/board.service';
import { Board, Task } from '../../shared/models/board.model';
import { TaskDialogComponent } from '../../shared/dialogs/task-dialog.component';

const colors: Record<string, EventColor> = {
  red: {
    primary: '#e74a4a',
    secondary: '#e74a4a',
    secondaryText: 'red',
  },
  blue: {
    primary: '#71deff',
    secondary: '#71deff',
    secondaryText: 'blue',
  },
  yellow: {
    primary: '#ffcf44',
    secondary: '#ffcf44',
    secondaryText: 'yellow',
  },
  green: {
    primary: '#36e9b6',
    secondary: '#36e9b6',
    secondaryText: 'green',
  },
  purple: {
    primary: '#b15cff',
    secondary: '#b15cff',
    secondaryText: 'purple',
  },
  gray: {
    primary: '#808080',
    secondary: '#808080',
    secondaryText: 'gray',
  },
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit, OnDestroy {
  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    // {
    //   label: '<i class="fas fa-fw fa-trash-alt"></i>',
    //   a11yLabel: 'Delete',
    //   onClick: ({ event }: { event: CalendarEvent }): void => {
    //     this.events = this.events.filter((iEvent) => iEvent !== event);
    //     this.handleEvent('Deleted', event);
    //   },
    // },
  ];

  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;

  refresh = new Subject<void>();

  sub: Subscription;

  boards: Board[];
  tasks: Task[] = [];
  events: CalendarEvent[] = [];
  isLoading: boolean = true;

  activeDayIsOpen: boolean = true;

  private readonly darkThemeClass = 'dark-theme';

  constructor(
    public boardService: BoardService,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    this.sub = this.boardService.getUserBoards().subscribe((boards) => {
      (this.boards = boards),
        (this.events = this.getEvents(boards)),
        (this.isLoading = false);
    });
    this.document.body.classList.add(this.darkThemeClass);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.document.body.classList.remove(this.darkThemeClass);
  }

  getEvents(
    boards: (Board & { id: string })[]
  ): CalendarEvent<Task & { boardId: string }>[] {
    var eventsList: CalendarEvent[];
    if (boards) {
      boards.forEach((board) => {
        board.tasks?.forEach((task) => {
          task.boardId = board.id;
        });
        this.tasks = (this.tasks || [])
          .concat(board.tasks!)
          .filter(
            (task) => task.startDate != undefined && task.endDate != undefined
          );
      });

      var events = this.tasks.map((task) => {
        return <CalendarEvent>{
          id: task.boardId,
          start: task.startDate,
          end: task.endDate,
          title: task.description,
          color: colors[task.label],
          actions: this.actions,
          allDay: true,
          cssClass: task.taskId,
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
          draggable: false,
        };
      });
      eventsList = events;
    } else {
      eventsList = [];
    }
    return eventsList;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.openTaskDialog(event);
  }

  openTaskDialog(event: CalendarEvent): void {
    var board = this.boards.filter((board) => board.id == event.id);
    var idx = board[0].tasks?.findIndex(
      (item) => item.taskId == event.cssClass
    );
    var boardId = event.id?.toString();
    var list = [];
    var task2 = [];
    list.push(event);
    var task = list.map((x) => {
      return <Task>{
        taskId: x.cssClass,
        description: x.title,
        label: x.color?.secondaryText,
        startDate: x.start,
        endDate: x.end,
      };
    });
    task2.push({
      task: task[0],
      boardId: event.id,
      isNew: false,
    });

    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px',
      data: task2[0],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (idx) {
          const update = board[0].tasks;
          update?.splice(idx, 1, result.task);
          this.boardService.updateTasks(boardId, board[0].tasks);
        }
      }
    });
  }

  // addEvent(): void {
  //   this.events = [
  //     ...this.events,
  //     {
  //       title: 'New event',
  //       start: startOfDay(new Date()),
  //       end: endOfDay(new Date()),
  //       color: colors['red'],
  //       draggable: true,
  //       resizable: {
  //         beforeStart: true,
  //         afterEnd: true,
  //       },
  //     },
  //   ];
  // }

  // deleteEvent(eventToDelete: CalendarEvent) {
  //   this.events = this.events.filter((event) => event !== eventToDelete);
  // }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
