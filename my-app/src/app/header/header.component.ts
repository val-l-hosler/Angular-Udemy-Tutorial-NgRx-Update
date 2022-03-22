import {Component, OnDestroy, OnInit} from '@angular/core';

import {map, Subscription} from 'rxjs';
import {Store} from '@ngrx/store';

import {DataStorageService} from '../services/data-storage.service';
import {AuthService} from '../services/auth.service';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipeBookActions from '../recipe-book/store/recipe-book.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userSubscription: Subscription;
  isLoggedIn;

  constructor(private dataStorageService: DataStorageService, private authService: AuthService,
              private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    this.userSubscription = this.store.select('auth')
      .pipe(
        map((authState) => authState.user)
      )
      .subscribe((user) => {
        (user) ? this.isLoggedIn = true : this.isLoggedIn = false;
      });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.store.dispatch(new RecipeBookActions.FetchRecipes())
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }
}
