import {Directive, ElementRef, HostBinding, HostListener, Input, OnInit, Renderer2} from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective implements OnInit {
  // Adds a css class when the element is clicked, and remove it if it's clicked again
  @Input() defaultClass = '';
  @HostBinding('class') class: string;

  constructor(private elemRef: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit() {
    this.class = this.defaultClass;
  }

  @HostListener('click') click(eventData: Event) {
    (this.class === 'open') ? this.class = '' : this.class = 'open';
  }

}
