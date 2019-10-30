import { Component, OnInit, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'app-validation-symbol',
  templateUrl: './validation-symbol.component.html',
  styleUrls: ['./validation-symbol.component.css']
})
export class ValidationSymbolComponent implements OnInit {
  @HostBinding('class.position-top-right') topRight = true;
  @HostBinding('class.position-inline') inline = false;

  @Input()
  public status: 'Validated' | 'Not Validated' | 'Loading' = 'Validated';

  @Input()
  public position: 'Top Right' | 'Inline';

  constructor() { }

  ngOnInit() {
    this.topRight = this.position === 'Top Right';
    this.inline = this.position === 'Inline';
  }

}
