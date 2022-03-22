// Actions is one big observable that will give you access to all the dispatched actions, so you can react to them
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {Injectable} from '@angular/core';

import {Actions, createEffect, ofType} from '@ngrx/effects';

import {catchError, map, of, switchMap, take, tap} from 'rxjs';

import * as AuthActions from './auth.actions';

import {environment} from '../../../environments/environment';

import {RecipeService} from '../../services/recipe.service';
import {AuthService} from '../../services/auth.service';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const errorSwitch = (errResponse) => {
  let errorMessage = 'An unknown error occurred.';

  if (errResponse.error.error.message) {
    switch (errResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'The email address is already in use by another account.';
        break;
      case 'OPERATION_NOT_ALLOWED':
        errorMessage = 'Password sign-in is disabled for this project.';
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'The password is invalid or the user does not have a password.';
        break;
      case 'USER_DISABLED':
        errorMessage = 'The user account has been disabled by an administrator.';
        break;
    }
  }

  return errorMessage;
}

// In this class you don't change the state, but you can execute any other code you need to when an action is dispatched
@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private recipesService: RecipeService,
    private authService: AuthService
  ) {
  }

  authSignUp = createEffect((): any => {
    return this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((authData: AuthActions.SignupStart) => {
        return this.http.post<AuthResponseData>
        ('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey, {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }).pipe(
          map((resData: AuthResponseData) => {
            const expirationDate = new Date(new Date().getTime() + (+resData.expiresIn * 1000));
            return new AuthActions.Signup({
              email: resData.email,
              userId: resData.localId,
              token: resData.idToken,
              expirationDate
            });
          }),
          catchError((errResponse) => {
            return of(new AuthActions.SignupFail(errorSwitch(errResponse)));
          })
        )
      })
    )
  });

  authLogin =
    createEffect((): any => {
      return this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {
          return this.http.post<AuthResponseData>
          ('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='
            + environment.firebaseAPIKey,
            {
              email: authData.payload.email,
              password: authData.payload.password,
              returnSecureToken: true
            }
          ).pipe(
            tap(resData => {
              this.authService.setLogoutTimer(+resData.expiresIn * 1000);
            }),
            map((resData: AuthResponseData) => {
              localStorage.setItem('userData', JSON.stringify({
                email: resData.email,
                userId: resData.localId,
                token: resData.idToken,
                expirationDate: new Date(new Date().getTime() + (+resData.expiresIn * 1000))
              }));

              return new AuthActions.Login({
                user: {
                  email: resData.email,
                  userId: resData.localId,
                  token: resData.idToken,
                  expirationDate: new Date(new Date().getTime() + (+resData.expiresIn * 1000))
                }
              });
            }),
            catchError((errResponse) => {
              // needs to return a non-error observable so our entire stream doesn't die
              return of(new AuthActions.LoginFail(errorSwitch(errResponse)));
            }));
        }),
        take(1)
      )
    });

  // Because this effect doesn't return an Observable that holds a new effect
  authSuccess = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.LOGIN),
      tap((resData: any) => {
        if (!resData.payload.sentFrom) {
          setTimeout(() => {
            this.router.navigate(['/recipes']);
          }, 2000);
        } else {
          let url = '/recipes';

          if (localStorage.getItem('currentUrl')) {
            url = localStorage.getItem('currentUrl');
          }

          this.router.navigate([url]);
        }
      })
    )
  }, {dispatch: false});

  authLogout = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.LOGOUT),
      tap(() => {
        this.authService.clearLogoutTimer();

        if (localStorage.getItem('userData')) {
          localStorage.removeItem('userData');
        }

        if (localStorage.getItem('currentUrl')) {
          localStorage.removeItem('currentUrl');
        }

        this.router.navigate(['']);
      })
    )
  }, {dispatch: false})

  authAutoLogin = createEffect((): any => {
    return this.actions$.pipe(
      ofType(AuthActions.AUTO_LOGIN),
      map(() => {
        const userData: {
          email: string;
          userId: string;
          token: string;
          expirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));

        if (!userData) {
          return {type: 'DUMMY'};
        }

        const expirationDuration =
          new Date(userData.expirationDate).getTime() -
          new Date().getTime();

        this.authService.setLogoutTimer(expirationDuration);

        return new AuthActions.Login({
          user: {
            email: userData.email,
            userId: userData.userId,
            token: userData.token,
            expirationDate: new Date(userData.expirationDate)
          }, sentFrom: 'AutoLogin'
        });
      })
    )
  })
}
