import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { AuthGuard } from './user/auth.guard';

const routes: Routes = [
  {
    path: 'login', loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  },{
    path: 'kanban', loadChildren: () => import('./kanban/kanban.module').then(m => m.KanbanModule), canActivate: [AuthGuard]
  },{
    path: 'calendar', loadChildren: () => import('./calendar-view/calendar-view.module').then(m => m.CalendarViewModule), canActivate: [AuthGuard]
  },{
    path: '**', loadChildren: () => import('./kanban/kanban.module').then(m => m.KanbanModule), canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
