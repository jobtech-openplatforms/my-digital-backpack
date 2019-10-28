import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { GigSourceConnectionData } from '../../../datatypes/GigSourceConnectionData';
import { GigPlatformData } from '../../../datatypes/GigPlatformData';
import { GigDataEditorComponent } from '../gig-data-editor/gig-data-editor.component';

@Component({
  selector: 'app-gig-data-display',
  templateUrl: './gig-data-display.component.html',
  styleUrls: ['./gig-data-display.component.css']
})
export class GigDataDisplayComponent implements OnInit, OnChanges {

  @Input()
  data: GigSourceConnectionData;

  @Output()
  edit = new EventEmitter<{ editor: any, data: GigPlatformData }>();

  rating = 0;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.data && this.data.aggregatedData && this.data.aggregatedData.averageRating) {
      this.rating = this.data.aggregatedData.averageRating.value;
    }
  }

  onEditItem() {
    this.edit.emit({ editor: GigDataEditorComponent, data: this.data.aggregatedData });
  }

}
