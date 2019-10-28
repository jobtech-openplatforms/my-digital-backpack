import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { CertificateConnectionData } from '../../../../app/datatypes/CertificateConnectionData';
import { CertificationData } from '../../../../app/datatypes/CertificationData';
import { CertificateDataEditorComponent } from '../certificate-data-editor/certificate-data-editor.component';

@Component({
  selector: 'app-certificate-data-display',
  templateUrl: './certificate-data-display.component.html',
  styleUrls: ['./certificate-data-display.component.css']
})
export class CertificateDataDisplayComponent implements OnInit {
  @Input()
  data: CertificateConnectionData;

  @Output()
  edit = new EventEmitter<{ editor: any, data: CertificationData }>();

  rating = 0;

  constructor() { }

  ngOnInit() {
  }

  onEditItem() {
    this.edit.emit({ editor: CertificateDataEditorComponent, data: this.data.aggregatedData });
  }

}
