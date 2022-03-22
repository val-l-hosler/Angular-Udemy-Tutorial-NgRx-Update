import {NgModule} from '@angular/core';
import {AppComponent} from '../app.component';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import * as fromApp from '../store/app.reducer';

import {AuthInterceptor} from '../auth/auth-interceptor.interceptor';

import {HeaderComponent} from '../header/header.component';

import {SharedModule} from './shared.module';
import {AppRoutingModule} from './app-routing.module';

import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {StoreDevtoolsModule} from '@ngrx/store-devtools'

import {AuthEffects} from '../auth/store/auth.effects';
import {ShoppingListEffects} from '../shopping-list/store/shopping-list.effects';
import {RecipeBookEffects} from '../recipe-book/store/recipe-book.effects';

import {environment} from '../../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([AuthEffects, ShoppingListEffects, RecipeBookEffects]),
    StoreDevtoolsModule.instrument({logOnly: environment.production}),
    SharedModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
