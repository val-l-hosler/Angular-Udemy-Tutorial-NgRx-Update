import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DropdownDirective} from '../shared/dropdown/dropdown.directive';

import {LoadingSpinnerComponent} from '../shared/loading-spinner/loading-spinner.component';
import {AlertComponent} from '../shared/alert/alert.component';

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    AlertComponent,
    DropdownDirective
  ],
  exports: [
    CommonModule,
    DropdownDirective,
    AlertComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule {
}
