import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {Observable, Subject, Subscription} from 'rxjs';

import {Store} from '@ngrx/store';

import {AuthResponseData, AuthService} from '../services/auth.service';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoggedIn = true;
  isLoading = false;
  hasError = false;
  signUpSuccess = false;
  loginSuccess = false;

  error = new Subject<string>();
  errorMessage: string = null;

  success = new Subject<string>();
  successMessage: string = null;

  submitButtonText = '';
  buttonText = '';

  authOpObservable = new Observable<AuthResponseData>();

  errorSub: Subscription;
  successSub: Subscription;
  storeSub: Subscription;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute,
              private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    this.storeSub = this.store.select('auth')
      .subscribe((authState) => {
        this.isLoading = authState.loading;
        if (authState.authError) {
          this.hasError = true;
          this.errorMessage = authState.authError;
        }
        if (authState.user) {
          this.hasError = false;

          (this.isLoggedIn) ?
            this.success.next('You have successfully logged in. Redirecting to the recipes...') :
            this.success.next('You have successfully signed up.');
        }
      });

    this.setButtonText();

    this.errorSub = this.error.subscribe((value) => {
      this.errorMessage = value;
    });

    this.successSub = this.success.subscribe((value) => {
      this.successMessage = value;
      (this.successMessage === 'You have successfully signed up.') ? this.signUpSuccess = true : this.loginSuccess = true;
    });
  }

  ngOnDestroy() {
    this.errorSub.unsubscribe();
    this.successSub.unsubscribe();
    this.storeSub.unsubscribe();
  }

  onSwitchMode() {
    this.isLoggedIn = !this.isLoggedIn;
    this.setButtonText();
    this.clearMessages();
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;

    const email = form.value.email;
    const password = form.value.password;

    form.reset();

    if (!this.isLoggedIn) {
      this.store.dispatch(new AuthActions.SignupStart({email, password}));
    } else {
      this.store.dispatch(new AuthActions.LoginStart({email, password: password}));
    }
  }

  clearMessages() {
    this.isLoading = false;
    this.hasError = false;
    this.loginSuccess = false;
    this.signUpSuccess = false;
  }

  setButtonText() {
    if (this.isLoggedIn) {
      this.submitButtonText = 'Login';
      this.buttonText = 'Switch to Sign Up';
    } else {
      this.submitButtonText = 'Sign Up';
      this.buttonText = 'Switch to Login';
    }
  }

  onCloseAlert(closedAlert: boolean) {
    this.hasError = closedAlert;
  }
}
