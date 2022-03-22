import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

import {Store} from '@ngrx/store';

import {Recipe} from '../recipe-book/recipe.model';

import * as fromApp from '../store/app.reducer';
import * as RecipeBookActions from '../recipe-book/store/recipe-book.actions';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  constructor(private router: Router, private store: Store<fromApp.AppState>) {
  }

  setRecipes(recipeArr: Recipe[]) {
    this.store.dispatch(new RecipeBookActions.SetRecipes(recipeArr));
  }

  addRecipe(recipe: Recipe) {
    this.store.dispatch(new RecipeBookActions.AddRecipe(recipe));
  }

  updateRecipe(recipe: Recipe) {
    this.store.dispatch(new RecipeBookActions.UpdateRecipe(recipe));
  }

  deleteRecipe(recipe: Recipe) {
    this.store.dispatch(new RecipeBookActions.DeleteRecipe({recipe: recipe, sentFrom: 'delete'}));
  }
}
