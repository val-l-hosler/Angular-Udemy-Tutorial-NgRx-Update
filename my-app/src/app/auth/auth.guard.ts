import {Injectable} from '@angular/core';

import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';

import {map, Observable, take} from 'rxjs';

import {Store} from '@ngrx/store';

import {AuthService} from '../services/auth.service';

import * as fromApp from '../store/app.reducer';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private store: Store<fromApp.AppState>) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store.select('auth')
      .pipe(
        take(1),
        map((authState) => {
          const isAuth = !!authState.user;
          return (isAuth) ? true : this.router.createUrlTree(['']);
          // or could be return (user) ? true : false;
        })
      );
  }
}

