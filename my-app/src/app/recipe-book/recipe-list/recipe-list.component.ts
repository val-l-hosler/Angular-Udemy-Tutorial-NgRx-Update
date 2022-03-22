import {Component, OnInit} from '@angular/core';

import {map, Observable, Subscription} from 'rxjs';

import {Store} from '@ngrx/store';

import {RecipeService} from '../../services/recipe.service';

import {Recipe} from '../recipe.model';

import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  parentRecipes: Observable<Recipe[]>
  updatedRecipeList: Subscription;
  storeSub: Subscription;

  constructor(private recipeService: RecipeService, private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    this.parentRecipes = this.store.select('recipeBook').pipe(map((state) => state.recipes));
  }
}
