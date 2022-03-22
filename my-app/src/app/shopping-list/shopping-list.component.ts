import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';

import {ShoppingListService} from '../services/shopping-list.service';
import {AuthService} from '../services/auth.service';

import {Ingredient} from '../shared/ingredient.model';

import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients: Observable<{ ingredients: Ingredient[] }>;

  constructor(private shoppingListService: ShoppingListService,
              private authService: AuthService,
              private route: ActivatedRoute,
              private store: Store<fromApp.AppState>) {
  }

  // store is where you can access the app state
  // the type of the store is a description of all the different parts that are in the store
  // {ingredients: Ingredient[]} is what the reducer's state contains
  ngOnInit(): void {
    // Gives us an observable
    // .select helps you select a slice of the state
    // displaying the data
    this.ingredients = this.store.select('shoppingList');

    this.store.select('shoppingList').subscribe((list) => {
      this.store.dispatch(new ShoppingListActions.SaveListToLocalStorage(list.ingredients));
    })
  }

  onIngredientClick(ingredient: Ingredient) {
    this.shoppingListService.clickedIngredient.next(ingredient);
  }
}
