import {User} from '../user.model';

import * as AuthActions from './auth.actions';

export interface State {
  user: User;
  authError: string;
  signupError: string;
  loading: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  signupError: null,
  loading: false
};

export function authReducer(state = initialState, action: AuthActions.AuthActions) {
  switch (action.type) {
    case AuthActions.LOGIN:
      const user = new User(
        action.payload.user.email,
        action.payload.user.userId,
        action.payload.user.token,
        action.payload.user.expirationDate
      );

      return {
        ...state,
        user,
        authError: null,
        loading: false
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null,
        authError: null,
      };
    case AuthActions.LOGIN_START:
      return {
        ...state,
        user: null,
        authError: null,
        loading: true
      };
    case AuthActions.LOGIN_FAIL:
      return {
        ...state,
        authError: action.payload,
        loading: false
      };
    case
    AuthActions.SIGNUP:
      const signedupUser = new User(
        action.payload.email,
        action.payload.userId,
        action.payload.token,
        action.payload.expirationDate
      );

      return {
        ...state,
        user: signedupUser,
        signupError: null,
        loading: false
      };
    case
    AuthActions.SIGNUP_START:
      return {
        ...state,
        signupError: null,
        loading: true
      };
    case
    AuthActions.SIGNUP_FAIL:
      return {
        ...state,
        signupError: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
