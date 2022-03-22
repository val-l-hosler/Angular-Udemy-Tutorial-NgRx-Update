import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpParams
} from '@angular/common/http';

import {exhaustMap, map, Observable} from 'rxjs';

import {Store} from '@ngrx/store';

import {AuthService} from '../services/auth.service';

import * as fromApp from '../store/app.reducer';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  // the advantage of this is that it allows you to automatically update the server as well
  constructor(private authService: AuthService, private store: Store<fromApp.AppState>) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select('auth')
      .pipe(
        map((authState) => authState.user),
        exhaustMap((user) => {
          if (!user) {
            return next.handle(request);
          }
          // only try to add the token if you have a user
          const modifiedRequest = request.clone({params: new HttpParams().set('auth', user.token)});
          return next.handle(modifiedRequest);
        })
      );
  }
}
