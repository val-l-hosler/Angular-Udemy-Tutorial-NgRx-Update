import {Ingredient} from '../../shared/ingredient.model';

import * as ShoppingListActions from './shopping-list.actions';

const initialIngredients: Ingredient[] =
  (localStorage.getItem('shoppingListIngredients')) ?
    JSON.parse(localStorage.getItem('shoppingListIngredients')) :
    [
      new Ingredient('Apples', 5),
      new Ingredient('Tomatoes', 10)
    ];

const initialState = {
  ingredients: initialIngredients,
  clickedIngredient: null,
  previousClickedIngredient: null
};

export interface AppState {
  shoppingList: State;
}

export interface State {
  ingredients: Ingredient[];
  previousClickedIngredient?: Ingredient;
  clickedIngredient?: string;
}

export function shoppingListReducer(state = initialState,
                                    action: ShoppingListActions.ShoppingListActions) {

  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      // can't do state.ingredient.push() because state changes always have to be immutable
      const ingredientsArrAdd = [...state.ingredients];
      let indexAdd = -1;
      let oldAmount;

      ingredientsArrAdd.forEach((ingredient, index) => {
        if (action.payload.name === ingredient.name) {
          indexAdd = index;
          oldAmount = ingredient.amount;
        }
      });

      if (indexAdd > -1) {
        ingredientsArrAdd[indexAdd] = new Ingredient(action.payload.name, (action.payload.amount + oldAmount));
      } else {
        ingredientsArrAdd.push(action.payload);
      }

      return {
        ...state,
        ingredients: ingredientsArrAdd
      };
    case ShoppingListActions.UPDATE_INGREDIENTS:
      return {
        ...state,
        ingredients: [...action.payload]
      };
    case ShoppingListActions.RECIPE_DETAIL_UPDATE_INGREDIENTS:
      let updatedRecipeIngredients = [...action.payload];
      const ingredientsArrUpdate = [...state.ingredients];
      let editedIngredients = [];
      const finalIngredients = [];

      // This checks to see if the ingredient's amount needs updating
      if (updatedRecipeIngredients.length > 0) {
        for (let i = 0; i < updatedRecipeIngredients.length; i++) {
          for (let j = 0; j < ingredientsArrUpdate.length; j++) {
            // I added this because it was throwing an error in the console
            const nameDefined = updatedRecipeIngredients[i].name && ingredientsArrUpdate[j].name;

            if (nameDefined && updatedRecipeIngredients[i].name === ingredientsArrUpdate[j].name) {
              let updatedAmount = +updatedRecipeIngredients[i].amount + +ingredientsArrUpdate[j].amount;
              editedIngredients.push(new Ingredient(updatedRecipeIngredients[i].name, updatedAmount));
              updatedRecipeIngredients.splice(i, 1);
            }
          }
        }
      }

      // This checks to see if the ingredient on the OG array was edited
      if (editedIngredients.length > 0) {
        ingredientsArrUpdate.forEach((ingredient) => {
          let foundFlag = false;

          editedIngredients.forEach((editedIngredient) => {
            // I added this because it was throwing an error in the console
            const nameDefined = ingredient.name && editedIngredient.name;

            if (nameDefined && ingredient.name === editedIngredient.name) {
              foundFlag = true;
            }
          });

          (!foundFlag) ? finalIngredients.push(ingredient) : null;
        });
      } else {
        finalIngredients.push(...ingredientsArrUpdate);
      }

      finalIngredients.push(...updatedRecipeIngredients);
      finalIngredients.push(...editedIngredients);

      return {
        ...state,
        ingredients: finalIngredients
      };

    case ShoppingListActions.EDIT_UPDATE_INGREDIENTS:
      const ingredientsArrEdit = [...state.ingredients];
      const ingredientNames = ingredientsArrEdit.map((ingredient) => ingredient.name);
      const updatedIngredients = [];
      const clickedIngredient = state.clickedIngredient.slice();

      let clickedIngredientIndex = -1;

      // Needed to do it this way because indexOf wouldn't work
      ingredientNames.forEach((ingredient, index) => {
        if (clickedIngredient.trim() === ingredient.trim()) {
          clickedIngredientIndex = index;
        }
      });

      for (let i = 0; i < ingredientsArrEdit.length; i++) {
        if (i === clickedIngredientIndex) {
          updatedIngredients.push(new Ingredient(action.payload.name, action.payload.amount));
        } else {
          updatedIngredients.push(ingredientsArrEdit[i]);
        }
      }

      return {
        ...state,
        ingredients: updatedIngredients
      };

    case ShoppingListActions.DELETE_INGREDIENT:
      const ingredients = [...state.ingredients];

      const index = ingredients.indexOf(action.payload);

      (index > -1) ? ingredients.splice(index, 1) : null;

      return {
        ...state,
        ingredients: ingredients // or could be ingredients.filter((elem, idx) => idx !== index));
      };
    case ShoppingListActions.CLICKED_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients,
        clickedIngredient: action.payload
      };
    default: // to use the initial state and return it unchanged
      // don't set the local storage here because this automatically loads every time you refresh
      return state;
  }
}
