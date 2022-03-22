import {Action} from '@ngrx/store';

// Add the feature name in [] to avoid clashes because all actions reach all reducers

// Instead of recycling/repeating for both login and signup, you could do it all in one with AUTHENTICATE_SUCCESS and AUTHENICATE_FAIL
export const LOGIN_START = '[Auth] Login Start';
export const LOGIN_FAIL = '[Auth] Login Fail';
export const LOGIN = '[Auth] Login';
export const AUTO_LOGIN = '[Auth] Auto Login';
export const AUTO_LOGOUT = '[Auth] Auto Logout';
export const LOGOUT = '[Auth] Logout';
export const SIGNUP_START = '[Auth] Signup Start';
export const SIGNUP_FAIL = '[Auth] Signup Fail';
export const SIGNUP = '[Auth] Signup';

export class Login implements Action {
  readonly type = LOGIN;

  constructor(public payload: { user: { email: string, userId: string, token: string, expirationDate: Date }, sentFrom?: string }) {
  }
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(public payload: { email: string; password: string }) {
  }
}

export class LoginFail implements Action {
  readonly type = LOGIN_FAIL;

  constructor(public payload: string) {
  }
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export class AutoLogout implements Action {
  readonly type = AUTO_LOGOUT;
}

export class Signup implements Action {
  readonly type = SIGNUP;

  constructor(public payload: { email: string, userId: string, token: string, expirationDate: Date }) {
  }
}

export class SignupStart implements Action {
  readonly type = SIGNUP_START;

  constructor(public payload: { email: string; password: string }) {
  }
}

export class SignupFail implements Action {
  readonly type = SIGNUP_FAIL;

  constructor(public payload: string) {
  }
}

export type AuthActions =
  Login
  | Logout
  | LoginStart
  | LoginFail
  | AutoLogin
  | AutoLogout
  | Signup
  | SignupStart
  | SignupFail;
