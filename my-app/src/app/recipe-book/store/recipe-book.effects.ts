import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

import {map, switchMap, tap, withLatestFrom} from 'rxjs';

import {Store} from '@ngrx/store';
import {Actions, createEffect, ofType} from '@ngrx/effects';

import {Recipe} from '../recipe.model';

import * as fromApp from './../../store/app.reducer';
import * as RecipeBookActions from './recipe-book.actions';

@Injectable()
export class RecipeBookEffects {
  storeRecipesFunc = (type) => {
    return createEffect((): any => {
      return this.actions$.pipe(
        ofType(type),
        tap(() => {
          localStorage.setItem('currentUrl', '/recipes');

          if (type === RecipeBookActions.UPDATE_RECIPE || RecipeBookActions.ADD_RECIPE || RecipeBookActions.DELETE_RECIPE || RecipeBookActions.SET_RECIPES) {
            this.router.navigate(['/recipes']);
          }
        }),
        map(() => new RecipeBookActions.StoreRecipes())
      )
    });
  }

  fetchRecipes = createEffect((): any => {
    return this.actions$.pipe(
      ofType(RecipeBookActions.FETCH_RECIPES),
      switchMap(() => {
        return this.http.get<Recipe[]>('https://ng-recipe-app-16b78-default-rtdb.firebaseio.com/recipes.json')
      }),
      map((responseData) => {
        return (responseData as Recipe[])
          .map((recipe) => {
            // returns a new object with the other recipe key/values, then if ingredients is not defined, set it to an empty array
            return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
          });
      }),
      map((recipes) => new RecipeBookActions.SetRecipes(recipes))
    )
  });

  setRecipes = this.storeRecipesFunc(RecipeBookActions.SET_RECIPES);

  addRecipe = this.storeRecipesFunc(RecipeBookActions.ADD_RECIPE);

  updateRecipe = this.storeRecipesFunc(RecipeBookActions.UPDATE_RECIPE);

  deleteRecipe = this.storeRecipesFunc(RecipeBookActions.DELETE_RECIPE);

  storeRecipes = createEffect((): any => {
    return this.actions$.pipe(
      ofType(RecipeBookActions.STORE_RECIPES),
      withLatestFrom(this.store$),
      tap(([action, state]: any) => {
        localStorage.setItem('recipes', JSON.stringify(state.recipeBook.recipes));

        if (state.recipeBook.sentFrom) {
          if (localStorage.getItem('selectedRecipe')) {
            localStorage.removeItem('selectedRecipe')
            localStorage.setItem('currentUrl', '/recipes');
          }
        } else {
          localStorage.setItem('selectedRecipe', JSON.stringify(state.recipeBook.selectedRecipe));
        }
      })
    )
  }, {dispatch: false});

  constructor(private actions$: Actions, private http: HttpClient, private store$: Store<fromApp.AppState>, private router: Router) {
  }
}
