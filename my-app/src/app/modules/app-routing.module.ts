import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule} from '@angular/router';

import {SharedModule} from './shared.module';

const appRoutes = [
  {
    path: 'recipes',
    loadChildren: () =>
      import('./recipes.module').then((m) => m.RecipesModule)
  },
  {
    path: 'shopping-list',
    loadChildren: () =>
      import('./shopping-list.module').then(
        (m) => m.ShoppingListModule
      )
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth.module').then((m) => m.AuthModule)
  },
  {path: '', redirectTo: 'auth', pathMatch: 'full'}
];

@NgModule({
  declarations: [],
  exports: [RouterModule],
  imports: [
    SharedModule,
    RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})
  ]
})
export class AppRoutingModule {
}
