import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {Store} from '@ngrx/store';
import {map, Observable, switchMap, take, tap} from 'rxjs';


import {ShoppingListService} from '../../services/shopping-list.service';
import {RecipeService} from '../../services/recipe.service';
import {AuthService} from '../../services/auth.service';

import {Recipe} from '../recipe.model';
import {Ingredient} from '../../shared/ingredient.model';

import * as fromApp from '../../store/app.reducer';
import * as RecipeBookActions from '../store/recipe-book.actions';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe?: Recipe;
  ingredients: Observable<{ ingredients: Ingredient[] }>;
  name: string;

  constructor(
    private recipeService: RecipeService,
    private shoppingListService: ShoppingListService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {

    this.route.params.pipe(
      tap(() => {
        const url = this.router.url.replace(/%20/g, ' ');
        localStorage.setItem('currentUrl', url);
      }),
      map((params) => {
        return params.name;
      }),
      tap((name: string): any => {
        this.name = name.replace(/%20/g, ' ');
        this.store.dispatch(new RecipeBookActions.GetRecipe(this.name));
      }),
      switchMap(() => this.store.select('recipeBook').pipe(take(1)))
    ).subscribe((state) => {
      this.recipe = state.selectedRecipe;
    });
  }

  onClickSendToShoppingList(ingredients: Ingredient[]) {
    this.store.dispatch(new ShoppingListActions.RecipeDetailUpdateIngredients(ingredients));
  }

  onDeleteRecipe() {
    this.recipeService.deleteRecipe(this.recipe);
  }
}
