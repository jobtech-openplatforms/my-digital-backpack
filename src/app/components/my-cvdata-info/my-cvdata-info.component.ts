import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrganizationData } from '../../datatypes/OrganizationData';

@Component({
  selector: 'app-my-cvdata-info',
  templateUrl: './my-cvdata-info.component.html',
  styleUrls: ['./my-cvdata-info.component.css']
})
export class MyCVDataInfoComponent implements OnInit {
  @Input()
  public organization: OrganizationData;

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  onConfirm() {
    this.activeModal.close();
  }

  onCancel() {
    this.activeModal.dismiss();
  }

}
