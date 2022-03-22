import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {ShoppingListComponent} from '../shopping-list/shopping-list.component';
import {ShoppingListEditComponent} from '../shopping-list/shopping-list-edit/shopping-list-edit.component';

import {SharedModule} from './shared.module';

@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingListEditComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([
        {
          path: '', component: ShoppingListComponent, children: [
            {path: ':name', component: ShoppingListComponent}
          ]
        }
      ]
    )
  ]
})
export class ShoppingListModule {
}
