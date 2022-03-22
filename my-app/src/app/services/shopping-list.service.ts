import {Injectable} from '@angular/core';

import {Subject} from 'rxjs';

import {Ingredient} from '../shared/ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  clickedIngredient = new Subject<Ingredient>();

  constructor() {
  }
}
