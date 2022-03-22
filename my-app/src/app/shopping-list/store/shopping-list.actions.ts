import {Action} from '@ngrx/store';
import {Ingredient} from '../../shared/ingredient.model';

// Add the feature name in [] to avoid clashes because all actions reach all reducers

export const ADD_INGREDIENT = '[Shopping List] Add Ingredient';
export const UPDATE_INGREDIENTS = '[Shopping List] Update Ingredients';
export const RECIPE_DETAIL_UPDATE_INGREDIENTS = '[Shopping List] Recipe Detail Update Ingredients';
export const EDIT_UPDATE_INGREDIENTS = '[Shopping List] Edit Update Ingredients';
export const DELETE_INGREDIENT = '[Shopping List] Delete Ingredient';
export const CLICKED_INGREDIENT = '[Shopping List] Clicked Ingredient';
export const SAVE_LIST_TO_LOCAL_STORAGE = '[Shopping List] Save List To Local Storage';

// action is an object of type Action
export class AddIngredient implements Action {
  // readonly indicates that it should never be changed from outside
  // the type is the identifier of the action
  readonly type = ADD_INGREDIENT;
  // this is the data that is sent/added
  // payload: Ingredient; do not have to use the name payload

  constructor(public payload: Ingredient) {
  }
}

export class UpdateIngredients implements Action {
  readonly type = UPDATE_INGREDIENTS;

  constructor(public payload: Ingredient[]) {
  }
}


export class RecipeDetailUpdateIngredients implements Action {
  readonly type = RECIPE_DETAIL_UPDATE_INGREDIENTS;

  constructor(public payload: Ingredient[]) {
  }
}

export class DeleteIngredient implements Action {
  readonly type = DELETE_INGREDIENT;

  constructor(public payload: Ingredient) {
  }
}

export class EditUpdateIngredients implements Action {
  readonly type = EDIT_UPDATE_INGREDIENTS;

  constructor(public payload: { name: string, amount: number, clickedIngredient: Ingredient }) {
  }
}

export class ClickedIngredient implements Action {
  readonly type = CLICKED_INGREDIENT;

  constructor(public payload: string) {
  }
}

export class SaveListToLocalStorage implements Action {
  readonly type = SAVE_LIST_TO_LOCAL_STORAGE;

  constructor(public payload: Ingredient[]) {
  }
}

export type ShoppingListActions =
  AddIngredient
  | UpdateIngredients
  | RecipeDetailUpdateIngredients
  | EditUpdateIngredients
  | DeleteIngredient
  | ClickedIngredient
  | SaveListToLocalStorage;
