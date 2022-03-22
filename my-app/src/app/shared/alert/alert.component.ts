import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  @Input() message;
  @Output() hasErrorAlert = new EventEmitter<boolean>();

  constructor() {
  }

  ngOnInit(): void {
  }

  onClose() {
    // this.authService.hasErrorAlert.next(false);
    this.hasErrorAlert.emit(false);
  }

}
