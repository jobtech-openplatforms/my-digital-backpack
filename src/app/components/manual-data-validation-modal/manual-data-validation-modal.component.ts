import { Component, OnInit, Input } from '@angular/core';
import { DynamicFormValueEmail, DynamicFormValueText } from '../dynamic-form/dynamic-form.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GigSourceConnectionData } from '../../datatypes/GigSourceConnectionData';
import { AuthenticationService } from '../../services/authentification.service';
import { CvdataService } from '../../services/cvdata.service';
import { DataSourcesService } from '../../services/data-sources.service';

@Component({
  selector: 'app-manual-data-validation-modal',
  templateUrl: './manual-data-validation-modal.component.html',
  styleUrls: ['./manual-data-validation-modal.component.css']
})

export class ManualDataValidationModalComponent implements OnInit {
  @Input()
  data: GigSourceConnectionData;

  @Input()
  email = '';

  public validateFormValues;
  public validateFormData = {
    email: '',
    profileUrl: ''
  };

  constructor(
    private activeModal: NgbActiveModal,
    private dataSources: DataSourcesService,
    private auth: AuthenticationService,
    private readonly _cvDataService: CvdataService
  ) { }

  ngOnInit() {
    this.validateFormData.email = this.auth.currentUserEmail;
  }

  onConfirm = () => {


    this.dataSources.requestVerificationByEmail(
      this.auth.currentUserId,
      this.data.id,
      this.validateFormData.email,
      this.validateFormData.profileUrl
    );
    // this.activeModal.close({});
  }

  onCancel() {
    this.activeModal.dismiss();
  }
}
