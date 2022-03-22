// Make sure you import the angular modules you need too
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {AuthGuard} from '../auth/auth.guard';

import {RecipeListComponent} from '../recipe-book/recipe-list/recipe-list.component';
import {RecipeItemComponent} from '../recipe-book/recipe-list/recipe-item/recipe-item.component';
import {RecipeDetailComponent} from '../recipe-book/recipe-detail/recipe-detail.component';
import {RecipeBookComponent} from '../recipe-book/recipe-book.component';
import {RecipeEditComponent} from '../recipe-book/recipe-edit/recipe-edit.component';
import {EmptyDetailComponent} from '../recipe-book/empty-detail/empty-detail.component';

import {SharedModule} from './shared.module';

@NgModule({
  declarations: [
    RecipeListComponent,
    RecipeItemComponent,
    RecipeDetailComponent,
    RecipeBookComponent,
    RecipeEditComponent,
    EmptyDetailComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([
        {
          path: '', canActivate: [AuthGuard], component: RecipeBookComponent, children: [
            {path: '', component: EmptyDetailComponent},
            {path: 'new', component: RecipeEditComponent},
            {path: ':name', component: RecipeDetailComponent},
            {path: ':name/edit', component: RecipeEditComponent},
          ]
        }
      ]
    )
  ]
})
export class RecipesModule {
}
