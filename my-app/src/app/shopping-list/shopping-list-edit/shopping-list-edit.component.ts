import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {Observable, Subscription, take} from 'rxjs';
import {Store} from '@ngrx/store';

import {ShoppingListService} from '../../services/shopping-list.service';
import {AuthService} from '../../services/auth.service';

import {Ingredient} from '../../shared/ingredient.model';

import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.css']
})
export class ShoppingListEditComponent implements OnInit, OnDestroy {
  clickedIngredient: Ingredient;
  getClickedIngredient: Subscription;
  clickedIngredientFlag = false;
  shoppingList: Observable<{ ingredients: Ingredient[] }>;

  @ViewChild('thisForm') form: NgForm;

  constructor(private shoppingListService: ShoppingListService, private router: Router, private authService: AuthService,
              private route: ActivatedRoute, private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    this.shoppingList = this.store.select('shoppingList');

    this.getClickedIngredient = this.shoppingListService.clickedIngredient.subscribe((ingredient) => {
        this.clickedIngredient = ingredient;
        this.clickedIngredientFlag = true;
        this.form.setValue({
          name: ingredient.name,
          amount: ingredient.amount
        });
      }
    );
  }

  ngOnDestroy() {
    this.getClickedIngredient.unsubscribe();
  }

  onAddIngredient(name: string, amount: number) {
    this.shoppingList.pipe(take(1)).subscribe((list) => {
      const names = list.ingredients.map((ingredient) => ingredient.name);

      if (this.clickedIngredientFlag && names.some((ingredientName) => ingredientName === name)) {
        this.onEditIngredient(name, this.clickedIngredient.amount + amount);
      } else {
        this.store.dispatch(new ShoppingListActions.AddIngredient(new Ingredient(name, amount)));
        this.onClear();
      }
    });
  }

  onEditIngredient(name: string, amount: number) {
    const url = this.router.url.split('%20');
    let previouslyClickedName = '';

    for (let i = 0; i < url.length; i++) {
      if (i === 0) {
        let sliced = url[i].replace('/shopping-list/', '');
        previouslyClickedName += sliced + ' ';
      } else if (i !== url.length - 1) {
        previouslyClickedName += url[i] + ' ';
      } else {
        previouslyClickedName += url[i];
      }
    }

    this.store.dispatch(new ShoppingListActions.ClickedIngredient(previouslyClickedName));

    this.store.dispatch(new ShoppingListActions.EditUpdateIngredients({
      name: name,
      amount: amount,
      clickedIngredient: this.clickedIngredient
    }));

    this.onClear();
  }

  onClear() {
    this.router.navigate(['/shopping-list']);
    this.clickedIngredientFlag = false;
    this.form.reset();
  }

  onDelete() {
    this.store.dispatch(new ShoppingListActions.DeleteIngredient(this.clickedIngredient));
    this.onClear();
  }
}
