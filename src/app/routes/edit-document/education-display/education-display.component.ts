import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EducationConnectionData } from '../../../datatypes/EducationConnectionData';
import { DegreeType } from '../../../datatypes/DegreeType';
import { EnterValueModalComponent } from '../../../components/enter-value-modal/enter-value-modal.component';

@Component({
  selector: 'app-education-display',
  templateUrl: './education-display.component.html',
  styleUrls: ['./education-display.component.css']
})
export class EducationDisplayComponent implements OnInit {

  @Input()
  data: EducationConnectionData;

  @Output()
  edit = new EventEmitter<{ editor: any, data: EducationConnectionData }>();

  public degreeType = DegreeType;

  constructor() { }

  ngOnInit() {
    console.log(this.data);
  }

  onEditItem() {
    this.edit.emit({ editor: EnterValueModalComponent, data: this.data });
  }

}
