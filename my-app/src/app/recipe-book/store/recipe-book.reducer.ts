import {Recipe} from '../recipe.model';

import * as RecipeBookActions from './recipe-book.actions';

export interface State {
  recipes: Recipe[],
  selectedRecipe: Recipe,
  sentFrom: string
}

let loadedRecipes: Recipe[];
let selectedRecipe: Recipe;

(localStorage.getItem('recipes')) ? loadedRecipes = [...JSON.parse(localStorage.getItem('recipes'))] : loadedRecipes = [];
(localStorage.getItem('selectedRecipe')) ? selectedRecipe = JSON.parse(localStorage.getItem('selectedRecipe')) : selectedRecipe = null;

const initialState: State = {
  recipes: loadedRecipes,
  selectedRecipe: selectedRecipe,
  sentFrom: null
};

export function recipeBookReducer(state = initialState, action: RecipeBookActions.RecipeBookActions) {
  switch (action.type) {
    case RecipeBookActions.SET_RECIPES:
      return {
        ...state,
        recipes: [...action.payload],
        sentFrom: null
      }
    case RecipeBookActions.ADD_RECIPE:
      let baseRecipesAdd = [];

      if (state.recipes.length > 0) {
        baseRecipesAdd = [...state.recipes];
      }

      const namesAdd = baseRecipesAdd.map((recipe) => recipe.name);
      const indexAdd = namesAdd.indexOf(action.payload.name);

      if (indexAdd > -1) {
        baseRecipesAdd.splice(indexAdd, 1, action.payload);
      }

      return {
        ...state,
        recipes: [...baseRecipesAdd],
        sentFrom: null
      }
    case RecipeBookActions.UPDATE_RECIPE:
      const baseRecipesUpdate = [...state.recipes];
      const namesUpdate = baseRecipesUpdate.map((recipe) => recipe.name);
      const indexUpdate = namesUpdate.indexOf(state.selectedRecipe.name);

      if (indexUpdate > -1) {
        baseRecipesUpdate.splice(indexUpdate, 1, action.payload);
      }

      return {
        ...state,
        recipes: [...baseRecipesUpdate],
        selectedRecipe: null,
        sentFrom: null
      }
    case RecipeBookActions.GET_RECIPE:
      let selectedRecipeGet: Recipe;

      if (state.recipes.length > 0) {
        state.recipes.forEach((recipe) => {
          if (recipe.name === action.payload) {
            selectedRecipeGet = recipe;
          }
        });
      }
      return {
        ...state,
        selectedRecipe: selectedRecipeGet,
        sentFrom: null
      }
    case RecipeBookActions.DELETE_RECIPE:
      const baseRecipesDelete = [...state.recipes];
      const namesDelete = baseRecipesDelete.map((recipe) => recipe.name);
      const indexDelete = namesDelete.indexOf(action.payload.recipe.name);

      if (indexDelete > -1) {
        baseRecipesDelete.splice(indexDelete, 1);
      }

      return {
        ...state,
        recipes: baseRecipesDelete,
        sentFrom: action.payload.sentFrom
      }
    default:
      return state;
  }
}
