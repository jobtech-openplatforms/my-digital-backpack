import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UserResources } from '../../../datatypes/UserResources';
import { ReviewConnectionData } from '../../../datatypes/ReviewConnectionData';
import { ReviewData } from '../../../datatypes/ReviewData';
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

@Component({
  selector: 'app-review-data-editor',
  templateUrl: './review-data-editor.component.html',
  styleUrls: ['./review-data-editor.component.css']
})
export class ReviewDataEditorComponent implements OnInit, OnDestroy {
  @Input()
  data: ReviewConnectionData;

  @Input()
  currentItems: ReviewConnectionData[];

  @Input()
  editorSettings: DynamicEditorSettings;

  state = 'selectReviewType';
  availableReviews: ReviewConnectionData[];
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
      this.state = 'selectReviewType';
    } else {
      if (this.data.connectionType === 'UserCreated') {
        this.state = 'manualEntry';
      } else {
        this.state = 'editDisplay';
      }
    }

    const userResourcesSub = this.serverData.getUserResources().subscribe((resources: UserResources) => { // TODO: remove subscription
      if (resources) {
        this.availableReviews = Utility.objectToArray(resources.reviews).map((data: ReviewData) => {
          const reviewData = new ReviewConnectionData();
          reviewData.aggregatedData = data;
          reviewData.isValidated = true;
          return reviewData;
        });
      } else {
        this.availableReviews = [];
      }
      console.log(this.availableReviews);
    });
    this.subscriptions.push(userResourcesSub);

    this.manualFormValues = [
      <DynamicFormValueTextarea>{
        name: 'Written review',
        propName: 'aggregatedData.summary',
        type: 'textarea',
        required: true
      },
      <DynamicFormGroup>{
        type: 'group',
        class: 'input-columns',
        children: [
          <DynamicFormValueText>{
            name: 'Reviewer name',
            propName: 'aggregatedData.reviewer.name',
            type: 'text',
            required: true
          },
          <DynamicFormValueText>{
            name: 'Reviewer title',
            propName: 'aggregatedData.reviewer.title',
            type: 'text',
            required: true
          }
        ]
      },
      <DynamicFormCustom>{
        type: 'custom',
        component: ImageUploadFormInputComponent,
        name: 'Reviewer photo',
        propName: 'aggregatedData.reviewer.photo',
        data: { imageSize: 256, imageName: this.userId + '/' + this.serverData.currentDocumentId + '/[TIMECODE]' }
      },
      <DynamicFormValueText>{
        name: 'Reviewer organization',
        propName: 'aggregatedData.organization.name',
        type: 'text',
        required: true
      },
      <DynamicFormGroup>{
        type: 'group',
        class: 'input-columns',
        children: [
          <DynamicFormValueNumber>{
            name: 'Rating',
            propName: 'aggregatedData.rating.value',
            type: 'number',
            valueMin: 0,
            valueStep: 1
          },
          <DynamicFormValueNumber>{
            name: 'Max rating',
            propName: 'aggregatedData.rating.max',
            type: 'number',
            valueMin: 0,
            valueStep: 1
          }
        ]
      },
      <DynamicFormValueMonth>{
        name: 'Work start',
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

  onSelectReview(review: ReviewConnectionData) {
    Utility.replaceObject(this.data, Utility.cloneObject(review));
    this.data.connectionType = 'Live';
    this.data.connectionState = 'Connected';
    this.data.isValidated = false;
    this.onSaveDataSource({ type: 'Save', confirmReview: true });
  }

  onConfirmManualData = () => {
    // this.data.connectionState = 'Manual';
    // if (this.data.isUserCreatedPlatform) {
    //   this.onSaveDataSource({ type: 'Save', newCustomDataSource: true });
    // } else {
    //   this.data.isValidated = false;
    //   this.onSaveDataSource({ type: 'Save', requireEmailValidation: true, askForManualValidation: true });
    // }
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
