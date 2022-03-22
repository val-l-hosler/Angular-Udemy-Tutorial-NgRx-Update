import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';

import {map} from 'rxjs';
import {Store} from '@ngrx/store';

import {RecipeService} from '../../services/recipe.service';
import {AuthService} from '../../services/auth.service';

import {Recipe} from '../recipe.model';
import {Ingredient} from '../../shared/ingredient.model';

import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  currentRecipe: Recipe;
  editMode = false;
  thisForm: FormGroup
  name: string;

  constructor(private route: ActivatedRoute, private recipeService: RecipeService,
              private router: Router, private authService: AuthService, private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    const url = this.router.url.replace(/%20/g, ' ');
    localStorage.setItem('currentUrl', url);

    this.thisForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'imageUrl': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required)
    });

    this.store.select('recipeBook').pipe(map((state) => state.selectedRecipe)).subscribe((recipe) => {
      this.currentRecipe = recipe;

      (this.router.url === '/recipes/new') ? this.editMode = false : this.editMode = true;

      if (this.editMode === true) {
        if (this.currentRecipe) {
          this.thisForm.patchValue({
            'name': this.currentRecipe.name,
            'imageUrl': this.currentRecipe.imagePath,
            'description': this.currentRecipe.description
          });

          this.thisForm.addControl('ingredientsArr', this.populateIngredients());
        }
      } else {
        this.currentRecipe = new Recipe('', '', '', []);
        this.thisForm.addControl('ingredientsArr', new FormArray([]));
      }
    });
  }

  populateIngredients(): FormArray {
    let ingredients = new FormArray([]);

    this.currentRecipe['ingredients'].forEach((ingredient) => {
      ingredients.push(new FormGroup({
        'name': new FormControl(ingredient.name, Validators.required),
        'amount': new FormControl(ingredient.amount, [Validators.required, Validators.min(1)])
      }));
    });

    return ingredients;
  }

  consolidateIngredients(ingredients): Ingredient[] {
    const jsonIngredients = [];

    ingredients.forEach((ingredient) => {
      let object = {};

      ingredients
        .filter((filteredIngredient) => ingredient.name === filteredIngredient.name)
        .forEach((ingredient) => {
          if (object.hasOwnProperty('amount')) {
            object['amount'] = object['amount'] + ingredient.amount;
          }

          if (!object.hasOwnProperty('name')) {
            object['name'] = ingredient.name;
            object['amount'] = ingredient.amount;
          }
        });

      const jsonify = JSON.stringify(object);
      const findItem = jsonIngredients.indexOf(jsonify);

      if (findItem === -1) {
        jsonIngredients.push(jsonify);
      }
    });

    return jsonIngredients.map((ingredient) => JSON.parse(ingredient));
  }

  onSubmit() {
    const name = this.thisForm.get('name').value;
    const url = this.thisForm.get('imageUrl').value;
    const description = this.thisForm.get('description').value;
    const ingredients = this.thisForm.get('ingredientsArr').value;

    if (!this.editMode) {
      this.recipeService.addRecipe(new Recipe(name, description, url, this.consolidateIngredients(ingredients)));
    } else {
      this.recipeService.updateRecipe(new Recipe(name, description, url, this.consolidateIngredients(ingredients)));
    }
  }

  onAddIngredient() {
    (this.thisForm.get('ingredientsArr') as FormArray).push(new FormGroup({
      'name': new FormControl(null, Validators.required),
      'amount': new FormControl(null, [Validators.required, Validators.min(1)])
    }));
  }

  onDeleteIngredient(index) {
    (this.thisForm.get('ingredientsArr') as FormArray).removeAt(index);
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onDeleteRecipe() {
    this.recipeService.deleteRecipe(this.currentRecipe);
  }

  get controls() {
    return (this.thisForm.get('ingredientsArr') as FormArray).controls;
  }
}
