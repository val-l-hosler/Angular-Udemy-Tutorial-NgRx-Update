import {Injectable} from '@angular/core';

import {Actions, createEffect, ofType} from '@ngrx/effects';

import * as ShoppingListActions from './shopping-list.actions';

import {tap} from 'rxjs';

@Injectable()
export class ShoppingListEffects {
  constructor(
    private actions$: Actions,
  ) {
  }

  updateLocalStorage = createEffect((): any => {
    return this.actions$.pipe(
      ofType(ShoppingListActions.SAVE_LIST_TO_LOCAL_STORAGE),
      tap((action: any) => {
        localStorage.setItem('shoppingListIngredients', JSON.stringify(action.payload));
      })
    )
  }, {dispatch: false});
}
