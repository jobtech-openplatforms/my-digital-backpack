import { Component, EventEmitter, OnInit, Input, Output, OnChanges } from '@angular/core';
import { ReviewConnectionData } from '../../../datatypes/ReviewConnectionData';
import { ReviewData } from '../../../datatypes/ReviewData';
import { ReviewDataEditorComponent } from '../review-data-editor/review-data-editor.component';

@Component({
  selector: 'app-review-data-display',
  templateUrl: './review-data-display.component.html',
  styleUrls: ['./review-data-display.component.css']
})
export class ReviewDataDisplayComponent implements OnInit, OnChanges {
  @Input()
  data: ReviewConnectionData;

  @Output()
  edit = new EventEmitter<{ editor: any, data: ReviewData }>();

  rating = 0;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.data && this.data.aggregatedData) {
      this.rating = this.data.aggregatedData.rating.value;
    }
  }

  onEditItem() {
    this.edit.emit({ editor: ReviewDataEditorComponent, data: this.data.aggregatedData });
  }

}
