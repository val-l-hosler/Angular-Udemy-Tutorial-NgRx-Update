import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {map, switchMap, take, tap} from 'rxjs';

import {Store} from '@ngrx/store';

import {RecipeService} from './recipe.service';

import {Recipe} from '../recipe-book/recipe.model';

import * as fromApp from '../store/app.reducer';
import * as RecipeBookActions from '../recipe-book/store/recipe-book.actions';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient, private recipeService: RecipeService, private store: Store<fromApp.AppState>) {
  }

  storeRecipes() {
    this.store.select('recipeBook').pipe(
      take(1),
      map((state) => state.recipes),
      switchMap((recipes) =>
        this.http.put('https://ng-recipe-app-16b78-default-rtdb.firebaseio.com/recipes.json', recipes))
    ).subscribe();
  }

  fetchRecipes() {
    return this.http.get('https://ng-recipe-app-16b78-default-rtdb.firebaseio.com/recipes.json')
      .pipe(
        map((responseData) => {
          return (responseData as Recipe[])
            .map((recipe) => {
              // returns a new object with the other recipe key/values, then if ingredients is not defined, set it to an empty array
              return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
            });
        }),
        tap((recipes) => {
          this.store.dispatch(new RecipeBookActions.SetRecipes(recipes))
        }));
  }
}
