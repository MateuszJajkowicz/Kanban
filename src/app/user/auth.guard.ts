import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { SnackService } from '../services/snack.service';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private afAuth: AngularFireAuth,
    private snack: SnackService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        // return this.afAuth.authState
        //   .pipe(
        //     take(1),
        //     map(user => !!user),
        //     tap(
        //       loggedIn => {
        //         if (!loggedIn) {
        //           this.snack.authError();
        //         }
        //       }
        //     )
        //   );
        return this.afAuth.user.pipe(
          map((user): boolean => !!user),
          tap((loggedIn: boolean) => {
            if (!loggedIn) {
              this.snack.authError();
            }
          })
        );
      }
}
