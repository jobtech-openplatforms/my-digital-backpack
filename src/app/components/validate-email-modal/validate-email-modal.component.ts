import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-validate-email-modal',
  templateUrl: './validate-email-modal.component.html',
  styleUrls: ['./validate-email-modal.component.css']
})
export class ValidateEmailModalComponent implements OnInit {
  @Input()
  email = '';

  constructor(private activeModal: NgbActiveModal) {
  }

  ngOnInit() {

  }

  onConfirm() {
    this.activeModal.close();
  }

  onCancel() {
    this.activeModal.dismiss();
  }

}
