import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PositionConnectionData } from '../../../datatypes/PositionConnectionData';
import { EnterValueModalComponent } from '../../../components/enter-value-modal/enter-value-modal.component';

@Component({
  selector: 'app-employment-display',
  templateUrl: './employment-display.component.html',
  styleUrls: ['./employment-display.component.css']
})
export class EmploymentDisplayComponent implements OnInit {

  @Input()
  data: PositionConnectionData;

  @Output()
  edit = new EventEmitter<{ editor: any, data: PositionConnectionData }>();

  constructor() { }

  ngOnInit() {
  }

  onEditItem() {
    this.edit.emit({ editor: EnterValueModalComponent, data: this.data });
  }

}
