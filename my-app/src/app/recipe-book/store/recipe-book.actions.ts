import {Action} from '@ngrx/store';

import {Recipe} from '../recipe.model';

export const SET_RECIPES = '[RecipeBook] Set Recipes';
export const FETCH_RECIPES = '[RecipeBook] Fetch Recipes';
export const GET_RECIPE = '[RecipeBook] Get Recipe';
export const ADD_RECIPE = '[RecipeBook] Add Recipe';
export const UPDATE_RECIPE = '[RecipeBook] Update Recipe';
export const DELETE_RECIPE = '[RecipeBook] Delete Recipe';
export const STORE_RECIPES = '[RecipeBook] Store Recipes';

export class SetRecipes implements Action {
  readonly type = SET_RECIPES;

  constructor(public payload: Recipe[]) {
  }
}

export class FetchRecipes implements Action {
  readonly type = FETCH_RECIPES;
}

export class GetRecipe implements Action {
  readonly type = GET_RECIPE;

  constructor(public payload: string) {
  }
}

export class AddRecipe implements Action {
  readonly type = ADD_RECIPE;

  constructor(public payload: Recipe) {
  }
}

export class UpdateRecipe implements Action {
  readonly type = UPDATE_RECIPE;

  constructor(public payload: Recipe) {
  }
}

export class DeleteRecipe implements Action {
  readonly type = DELETE_RECIPE;

  constructor(public payload: {recipe: Recipe, sentFrom: string}) {
  }
}

export class StoreRecipes implements Action {
  readonly type = STORE_RECIPES;
}

export type RecipeBookActions =
  SetRecipes
  | FetchRecipes
  | GetRecipe
  | AddRecipe
  | UpdateRecipe
  | DeleteRecipe
  | StoreRecipes;
