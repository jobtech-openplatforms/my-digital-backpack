import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UserResources } from '../../../datatypes/UserResources';
import { DynamicEditorSettings } from '../../../components/dynamic-data-editor-modal/dynamic-data-editor-modal.component';
import {
  DynamicFormItemBase, DynamicFormGroup, DynamicFormValueDate,
  DynamicFormValueNumber, DynamicFormValueText, DynamicFormValueTextarea,
  DynamicFormCustom,
  DynamicFormValueMonth
} from '../../../components/dynamic-form/dynamic-form.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataSourcesService } from '../../../services/data-sources.service';
import { ServerDataService } from '../../../services/server-data.service';
import { ImageUploadFormInputComponent } from '../../../components/image-upload-form-input/image-upload-form-input.component';
import { Utility } from '../../../utils/Utility';
import { CertificateConnectionData } from '../../../datatypes/CertificateConnectionData';
import { CertificationData } from '../../../datatypes/CertificationData';

@Component({
  selector: 'app-certificate-data-editor',
  templateUrl: './certificate-data-editor.component.html',
  styleUrls: ['./certificate-data-editor.component.css']
})
export class CertificateDataEditorComponent implements OnInit, OnDestroy {
  @Input()
  data: CertificateConnectionData;

  @Input()
  currentItems: CertificateConnectionData[];

  @Input()
  editorSettings: DynamicEditorSettings;

  state = 'selectCertificateType';
  availableCertificates: CertificateConnectionData[];
  manualFormValues: DynamicFormItemBase[] = [];
  isChanged = false;
  userId = '';
  documentId = '';

  private subscriptions = [];

  // stateHistory = [];
  // state: 'selectPlatform'
  //   | 'editDisplay'
  //   | 'emailValidation1'
  //   | 'emailValidation2'
  //   | 'oauthValidation1'
  //   | 'oauthValidation2'
  //   | 'manualEntry'
  //   | 'confirmManualEntry';

  constructor(
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private dataSources: DataSourcesService,
    private serverData: ServerDataService
  ) { }

  ngOnInit() {
    if (this.editorSettings.isNew) {
      this.state = 'selectCertificateType';
    } else {
      if (this.data.connectionType === 'UserCreated') {
        this.state = 'manualEntry';
      } else {
        this.state = 'editDisplay';
      }
    }

    const userResourcesSub = this.serverData.getUserResources().subscribe((resources: UserResources) => {
      if (resources) {
        this.availableCertificates = Utility.objectToArray(resources.certificates).map((data: CertificationData) => {
          const certificateData = new CertificateConnectionData();
          certificateData.aggregatedData = data;
          certificateData.isValidated = true;
          return certificateData;
        });
      } else {
        this.availableCertificates = [];
      }
      console.log(this.availableCertificates);
    });
    this.subscriptions.push(userResourcesSub);

    this.manualFormValues = [
      <DynamicFormValueTextarea>{
        name: 'Issuing organisation',
        propName: 'aggregatedData.organization.name',
        type: 'textarea',
        required: true
      },
      <DynamicFormCustom>{
        type: 'custom',
        component: ImageUploadFormInputComponent,
        name: 'Logotype/icon',
        propName: 'aggregatedData.organization.logotype',
        data: { imageSize: 256, imageName: this.userId + '/' + this.serverData.currentDocumentId + '/[TIMECODE]' }
      },
      <DynamicFormValueText>{
        name: 'Certificate title',
        propName: 'aggregatedData.title',
        type: 'text',
        required: true
      },
      <DynamicFormValueTextarea>{
        name: 'Description',
        propName: 'aggregatedData.summary',
        type: 'textarea',
        required: true
      },
      <DynamicFormGroup>{
        type: 'group',
        class: 'input-columns',
        children: [
          <DynamicFormValueNumber>{
            name: 'Score (optional)',
            propName: 'aggregatedData.scoreValue',
            type: 'number',
            valueMin: 0,
            valueStep: 1
          },
          <DynamicFormValueText>{
            name: 'Score label',
            propName: 'aggregatedData.scoreLabel',
            type: 'text',
          }
        ]
      },
      <DynamicFormValueMonth>{
        name: 'Date',
        propName: 'aggregatedData.date',
        type: 'month',
      }
    ];
  }

  onChangedData() {
    this.isChanged = true;
  }

  onDelete() {
    this.activeModal.close({ type: 'Delete' });
  }

  onSelectCertificate(certificate: CertificateConnectionData) {
    Utility.replaceObject(this.data, Utility.cloneObject(certificate));
    this.data.connectionType = 'Live';
    this.data.connectionState = 'Connected';
    this.data.isValidated = false;
    this.onSaveDataSource({ type: 'Save', confirmCertificate: true });
  }

  onConfirmManualData = () => {
    this.data.isValidated = false;
    this.onSaveDataSource({ type: 'Save', requireEmailValidation: false, askForManualValidation: false });
  }

  onSaveDataSource = (saveSettings) => {
    if (saveSettings == null) {
      saveSettings = { type: 'Save' };
    }
    this.activeModal.close(saveSettings);
  }

  onCancel() {
    this.activeModal.dismiss();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

}
