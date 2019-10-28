import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DocumentData } from '../../../datatypes/DocumentData';
import { ServerDataService } from '../../../services/server-data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sharing-modal',
  templateUrl: 'sharing-modal.component.html',
  styleUrls: ['sharing-modal.component.css'],
})

export class SharingModelComponent implements OnInit {
  public link = '';
  public documentId = '';

  constructor(private activeRoute: ActivatedRoute, private activeModal: NgbActiveModal, private serverData: ServerDataService) {
  }

  ngOnInit() {
    if (this.documentId) {
      this.link = window.location.origin + '/document/' + this.documentId; // TODO: store url in better way
    } else {
      this.link = window.location.href.replace('/edit-document', '/document');
    }
  }

  onConfirm() {
    this.activeModal.close();
  }

  onCancel() {
    this.activeModal.dismiss();
  }
}
