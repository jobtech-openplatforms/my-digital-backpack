import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DynamicEditorSettings } from '../../../components/dynamic-data-editor-modal/dynamic-data-editor-modal.component';
import { GigSourceConnectionData } from '../../../datatypes/GigSourceConnectionData';
import { DataSourceAuthType } from '../../../datatypes/DataSourceAuthType';
import { DataSourcesService } from '../../../services/data-sources.service';
import { ServerDataService } from '../../../services/server-data.service';
import {
  DynamicFormValueNumber,
  DynamicFormValueText,
  DynamicFormItemBase,
  DynamicFormGroup,
  DynamicFormCustom,
  DynamicFormValueTextarea,
  DynamicFormValueMonth
} from '../../../components/dynamic-form/dynamic-form.component';
import { CvdataService } from '../../../services/cvdata.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { DataSourcesManager } from '../../../managers/data-sources.manager';
import { ImageUploadFormInputComponent } from '../../../components/image-upload-form-input/image-upload-form-input.component';
import { GigPlatformInfo } from '../../../datatypes/GigPlatformInfo';

type State = 'selectPlatform'
  | 'editDisplay'
  | 'emailValidation1'
  | 'emailValidation2'
  | 'oauthValidation1'
  | 'oauthValidation2'
  | 'manualEntry'
  | 'confirmManualEntry'
  | 'cvDataAuthorize'
  | 'platformOAuthAuthorize';


@Component({
  selector: 'app-gig-data-editor',
  templateUrl: './gig-data-editor.component.html',
  styleUrls: ['./gig-data-editor.component.css']
})
export class GigDataEditorComponent implements OnInit {
  @Input()
  data: GigSourceConnectionData;

  @Input()
  currentItems: GigSourceConnectionData[];

  @Input()
  editorSettings: DynamicEditorSettings;

  @ViewChild('accessIframe') private _accessIframe: ElementRef;

  alreadyAddedPlatforms: string[];
  gigPlatforms: GigPlatformInfo[] = [];
  selectedPlatform: GigPlatformInfo;
  email = '';
  isEmailVerified = false;
  customFormValues: DynamicFormItemBase[];
  manualFormValues: DynamicFormItemBase[];
  isChanged = false;

  userId = '';
  documentId = '';

  stateHistory: State[] = [];

  state: State;

  cvDataAuthorizeUrl: SafeResourceUrl;
  platformOAuthUrl: SafeResourceUrl;

  constructor(
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private dataSources: DataSourcesService,
    private serverData: ServerDataService,
    private readonly _cvDataService: CvdataService,
    private readonly _dataSourcesManager: DataSourcesManager,
    private readonly _sanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
    if (this.editorSettings.isNew) {
      this.onSetState('selectPlatform');
    } else {
      if (this.data.connectionType !== 'Live') {
        this.onSetState('manualEntry');
      } else {
        this.onSetState('editDisplay');
      }
    }

    this.alreadyAddedPlatforms = this.currentItems.map(data => data.sourceId);

    this._dataSourcesManager.getAvailablePlatforms().subscribe((platforms) => {
      this.gigPlatforms = platforms;
    });

    this.serverData.getCurrentUser().then((user) => {
      this.email = user.email;
      this.userId = user.id;
    });

    this.customFormValues = [
      <DynamicFormValueText>{
        name: 'Plattform',
        propName: 'aggregatedData.organization.name',
        id: 'edit-organization-name',
        type: 'text',
      },
      <DynamicFormCustom>{
        type: 'custom',
        component: ImageUploadFormInputComponent,
        name: 'Logotyp',
        propName: 'aggregatedData.organization.logo',
        id: 'edit-organization-logo',
        data: { imageSize: 256, imageName: this.userId + '/' + this.serverData.currentDocumentId + '/[TIMECODE]' } // authenticatedUser
      },
      <DynamicFormValueTextarea>{
        name: 'Beskrivning',
        propName: 'aggregatedData.organization.description',
        id: 'edit-organization-description',
        type: 'textarea'
      },
    ];

    this.manualFormValues = [
      <DynamicFormGroup>{
        type: 'group',
        class: 'input-columns',
        children: [
          <DynamicFormValueMonth>{
            name: 'Start',
            propName: 'aggregatedData.startDate',
            id: 'edit-start-date',
            type: 'month',
          },
          <DynamicFormValueMonth>{
            name: 'End',
            propName: 'aggregatedData.endDate',
            id: 'edit-end-date',
            type: 'month',
          }
        ]
      },
      <DynamicFormValueNumber>{
        name: 'No of gigs',
        propName: 'aggregatedData.noOfGigs',
        id: 'edit-no-of-gigs',
        type: 'number',
        valueMin: 0,
        valueStep: 1
      }
    ];
  }

  onBack() {
    if (this.stateHistory.length > 0) {
      this.state = this.stateHistory.pop();
    }
  }

  onSetState(newState: State) {
    if (this.state) {
      this.stateHistory.push(this.state);
    }
    this.state = newState;
  }

  onSelectDataSource(platform: GigPlatformInfo) {
    this.selectedPlatform = platform;

    // updating source data with data from selected platform
    this.data.sourceId = platform.id;
    this.data.aggregatedData.organization = platform.organization;
    this.data.isValidated = false;
    this.data.connectionType = platform.connectionType;
    if (this.data.connectionType === 'Live') {
      this.data.sourceId = platform.externalPlatformId.toString();
      this.data.connectionState = 'Loading';
      this.onSelectConnectedDataSource(platform);
    } else if (this.data.connectionType === 'ManuallyUpdated') { // manual entry of data
      this.onSetState('manualEntry');
    } else if (this.data.connectionType === 'UserCreated') { // manual entry of data
      this.onSetState('manualEntry');
    }
  }

  private onSelectConnectedDataSource(platform: GigPlatformInfo) {
    // get platform connection info (for cvData authenticated user).
    // See if the platform is connected through CVData or if we need to kick that off
    this._cvDataService.getUserConnectionStatus(platform.externalPlatformId, platform.organization)
      .subscribe(platformConnectionInfo => {

        if (platform.authType === DataSourceAuthType.EmailValidation) {
          this.onSetState('emailValidation1');
        } else {
          this._cvDataService.connectOAuthPlatform(platform.externalPlatformId, platform.organization.name)
            .subscribe(didConnect => {
              if (didConnect) {
                const saveSettings = {
                  type: 'Save',
                  postOpFn: () => this._cvDataService.requestPlatformDataUpdateNotification(
                    platform.externalPlatformId,
                    platform.organization
                  )
                };
                this.onSaveDataSource(saveSettings);
              }
            });
        }
      });
  }

  onSubmitEmail = (emailForm) => {
    this._cvDataService.connectEmailPlatform(this.email, this.selectedPlatform.id, this.selectedPlatform.organization)
      .subscribe(emailConnectionResult => {
        this.onSaveDataSource();
      }, error => {
        console.log(error);
      });
  }

  onVerifiedEmail = () => {
    this.isEmailVerified = true;
  }

  onSubmitOauth = () => {

    this._cvDataService.connectOAuthPlatform(this.selectedPlatform.id, this.selectedPlatform.organization)
      .subscribe(() => {
        this.onSetState('oauthValidation2');
      }, error => console.error(error));
  }

  onChangedData() {
    this.isChanged = true;
  }

  onConfirmManualData = () => {
    this.data.connectionState = 'Manual';
    if (this.data.connectionType === 'UserCreated') {
      this.onSaveDataSource({ type: 'Save', newCustomDataSource: true });
    } else {
      this.data.isValidated = false;
      this.onSaveDataSource({ type: 'Save', requireEmailValidation: true, askForManualValidation: true });
    }
  }

  onRequestManualConfirmation = () => {
    return this.onSaveDataSource({ type: 'Save', requireEmailValidation: true, askForManualValidation: true });
  }

  onDelete() {
    this.activeModal.close({ type: 'Delete' });
  }

  onSaveDataSource = (saveSettings = null) => {
    if (saveSettings == null) {
      saveSettings = { type: 'Save', requireEmailValidation: false, askForManualValidation: false };
    }
    console.log('Have save settings', saveSettings);
    this.activeModal.close(saveSettings);
  }

  onCancel() {
    this.activeModal.dismiss();
  }
}
