import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ServerDataService } from '../../../app/services/server-data.service';
import { AuthenticationService } from '../../../app/services/authentification.service';
import { DynamicFormValueTextarea, DynamicFormValueEmail } from '../dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-feedback-modal',
  templateUrl: './feedback-modal.component.html',
  styleUrls: ['./feedback-modal.component.css']
})
export class FeedbackModalComponent implements OnInit {
  public formValues = [
    <DynamicFormValueTextarea>{
      name: 'Message',
      propName: 'message',
      id: 'edit-summary',
      type: 'textarea',
    },
    <DynamicFormValueEmail>{
      name: 'Your email',
      propName: 'email',
      required: true,
      type: 'email'
    }
  ];
  public data = {
    message: '',
    email: ''
  };

  constructor(private activeModal: NgbActiveModal, private auth: AuthenticationService, private serverData: ServerDataService) { }

  ngOnInit() {
    this.data.email = this.auth.currentUserEmail;
  }

  onConfirm = (form) => {
    return new Promise((resolve, reject) => {
      this.serverData.createServerCommand({ type: 'Feedback', data: { message: this.data.message, email: this.data.email } }, true).then(
        () => {
          resolve();
        },
        (e) => {
          reject(e);
        }
      );

      this.activeModal.close({ type: 'Sent' });
    });
  }

  onCancel() {
    this.activeModal.dismiss();
  }

}
