import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService, AuthenticatedUser } from '../../services/authentification.service';
import { ServerDataService } from '../../services/server-data.service';
import { EducationConnectionData } from '../../datatypes/EducationConnectionData';
import { PositionConnectionData } from '../../datatypes/PositionConnectionData';
import { ReviewConnectionData } from '../../datatypes/ReviewConnectionData';
import { GigSourceConnectionData } from '../../datatypes/GigSourceConnectionData';
import { DocumentData } from '../../datatypes/DocumentData';
import { CVCategoryCollection } from '../../datatypes/CVCategoryCollection';
import { CVCategoryType } from '../../datatypes/CVCategoryType';
import {
  DynamicFormValueDate, DynamicFormValueSelect, DynamicFormValueText, DynamicFormValueTextarea, DynamicFormValueBoolean,
  DynamicFormGroup, DynamicFormCustom
} from '../../components/dynamic-form/dynamic-form.component';
import { EducationDisplayComponent } from './education-display/education-display.component';
import { EditableListSettings, EditableListComponent } from '../../components/editable-list/editable-list.component';
import { EmploymentDisplayComponent } from './employment-display/employment-display.component';
import { GigDataDisplayComponent } from './gig-data-display/gig-data-display.component';
import { DynamicDataEditorModalComponent } from '../../components/dynamic-data-editor-modal/dynamic-data-editor-modal.component';
import { GigDataEditorComponent } from './gig-data-editor/gig-data-editor.component';
import { Utility } from '../../utils/Utility';
import { HeaderService } from '../../components/header/header.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageUploadFormInputComponent } from '../../components/image-upload-form-input/image-upload-form-input.component';
import { ReviewDataDisplayComponent } from './review-data-display/review-data-display.component';
import { ReviewDataEditorComponent } from './review-data-editor/review-data-editor.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { AlertModalComponent } from '../../components/alert-modal/alert-modal.component';
import { CertificateConnectionData } from '../../datatypes/CertificateConnectionData';
import { CertificateDataDisplayComponent } from './certificate-data-display/certificate-data-display.component';
import { CertificateDataEditorComponent } from './certificate-data-editor/certificate-data-editor.component';
import { EditCategoriesComponent } from './edit-categories/edit-categories.component';

@Component({
  selector: 'app-edit-document',
  templateUrl: './edit-document.component.html',
  styleUrls: ['./edit-document.component.css']
})
export class EditDocumentComponent implements OnInit, OnDestroy {
  isUpdateInProgress = false;
  document: DocumentData;
  userId;
  subscriptions = [];
  isEditable = false;

  educationSettings: EditableListSettings;
  employmentSettings: EditableListSettings;
  gigSettings: EditableListSettings;
  reviewSettings: EditableListSettings;
  certificateSettings: EditableListSettings;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private serverData: ServerDataService,
    private headerService: HeaderService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {

    this.isEditable = this.activatedRoute.snapshot.url[0].path === 'edit-document';

    this.headerService.pageTitle = '';
    this.headerService.backRoute = '';
    this.headerService.showSharing = false;
    this.headerService.showLoggedInUser = false;

    const authSubscription = this.authService.authenticatedUser.subscribe((authenticatedUser: AuthenticatedUser) => {
      if (authenticatedUser) {
        this.userId = authenticatedUser.uid;
      }
    });
    this.subscriptions.push(authSubscription);

    const documentId = this.activatedRoute.snapshot.paramMap.get('documentId');
    const documentSubscription = this.serverData.getCV(documentId).subscribe(doc => {
      console.log('Document updated');
      if (this.isUpdateInProgress) {
        return;
      }
      if (this.document) {
        Utility.replaceObject(this.document, doc);
      } else {
        this.document = <DocumentData>doc;
      }

      if (this.isEditable) {
        this.headerService.pageTitle = '' + this.document.name;
        this.headerService.showSharing = true;
        this.headerService.showLoggedInUser = true;
        this.headerService.backRoute = '/list';
      }

      this.updateListSettings();
    });
    this.subscriptions.push(documentSubscription);
  }

  onAddCategory() {
    const modalRef = this.modalService.open(AddCategoryComponent);
    modalRef.result.then((result) => {
      if (this.document.data.categories == null) {
        this.document.data.categories = [];
      }
      const type = result.type;

      // check if category already exists
      const found = this.document.data.categories.find((cat) => cat.type === type);
      if (found) {
        const alertModalRef = this.modalService.open(AlertModalComponent);
        const alertModalInstance = <AlertModalComponent>alertModalRef.componentInstance;
        alertModalInstance.title = 'Duplicate section';
        alertModalInstance.message =
          'You have already added a section with this type of items, do you really want to create a new section?';
        alertModalInstance.confirmLabel = 'Create new';
        alertModalInstance.dismissLabel = 'Cancel';
        alertModalRef.result.then(() => {
          this.addCategoryToList(type);
        }, () => { });
      } else {
        this.addCategoryToList(type);
      }

    },
      () => { }
    );
  }

  addCategoryToList(type) {
    const newCategory = new CVCategoryCollection();
    newCategory.list = [EditableListComponent.ADD_NEW_ITEM_CONSTANT];
    switch (type) {
      case CVCategoryType.gigWork:
        newCategory.type = CVCategoryType.gigWork;
        newCategory.title = 'Gigs';
        newCategory.emptyText = 'Here you can add work that you have done on gig platforms.';
        break;

      case CVCategoryType.educations:
        newCategory.type = CVCategoryType.educations;
        newCategory.title = 'Education';
        newCategory.emptyText = 'Here you can add any education you have completed.';
        break;

      case CVCategoryType.employments:
        newCategory.type = CVCategoryType.employments;
        newCategory.title = 'Employments';
        newCategory.emptyText = `Here you can add any employments you've had.`;
        break;

      case CVCategoryType.reviews:
        newCategory.type = CVCategoryType.reviews;
        newCategory.title = 'Recommendations';
        newCategory.emptyText = `Here you can add any recommendations you have got from clients or collegues.`;
        break;

      case CVCategoryType.certificate:
        newCategory.type = CVCategoryType.certificate;
        newCategory.title = 'Achievements';
        newCategory.emptyText = `Here you can add any badges/achievements from for example gig platforms.`;
        break;

      default:
        break;
    }
    console.log(this.document.data.categories);
    this.document.data.categories.push(newCategory);
  }

  onDocumentChange() {
    this.onSaveDocument();
  }

  onEditCategories() {
    const modalRef = this.modalService.open(EditCategoriesComponent, { backdrop: 'static' });
    const modalInstance = <EditCategoriesComponent>modalRef.componentInstance;
    modalInstance.categories = this.document.data.categories;
    modalRef.result.then((result) => {
      if (result.type === 'Save') {
        this.onSaveDocument();
      }
    });
  }

  onSaveDocument() {
    console.log('save document', this.document);
    this.isUpdateInProgress = true;
    this.serverData.saveCV(this.document.id, this.document).then(() => {
      this.isUpdateInProgress = false;
    });
  }

  updateListSettings() {
    this.educationSettings = new EditableListSettings();
    this.educationSettings.dataType = EducationConnectionData;
    this.educationSettings.rendererComponent = EducationDisplayComponent;
    this.educationSettings.editorComponent = DynamicDataEditorModalComponent;
    this.educationSettings.editorSettings = {
      title: 'Education',
      isNew: false,
      isDeleteEnabled: true,
      formValues: [
        <DynamicFormValueText>{
          name: 'School/university',
          propName: 'aggregatedData.organization.name',
          id: 'edit-organization-name',
          type: 'text',
        },
        <DynamicFormCustom>{
          type: 'custom',
          component: ImageUploadFormInputComponent,
          name: 'Logo',
          propName: 'aggregatedData.organization.logo',
          id: 'edit-organization-logo',
          data: { imageSize: 256, imageName: this.userId + '/' + this.document.id + '/[TIMECODE]' } // authenticatedUser
        },
        <DynamicFormGroup>{
          type: 'group',
          class: 'input-columns',
          children: [
            <DynamicFormValueText>{
              name: 'Field of study',
              propName: 'aggregatedData.fieldOfStudy',
              id: 'edit-field-of-study',
              type: 'text',
            },
            <DynamicFormValueSelect>{
              name: 'Degree',
              propName: 'aggregatedData.degree',
              id: 'edit-degree',
              type: 'select',
              options: [
                { label: 'None', value: 'None' },
                { label: 'Single course', value: 'SingleCourses' },
                { label: 'Higher education diploma', value: 'HigherEducationDiploma' },
                { label: 'Bachelor', value: 'Bachelor' },
                { label: 'Master', value: 'Master' },
                { label: 'Licenciate', value: 'Licenciate' },
                { label: 'Doctorate', value: 'Doctorate' }
              ]
            }
          ]
        },
        <DynamicFormGroup>{
          type: 'group',
          class: 'input-columns',
          children: [
            <DynamicFormValueDate>{
              name: 'Start',
              propName: 'aggregatedData.startDate',
              id: 'edit-start-date',
              type: 'date',
            },
            <DynamicFormValueDate>{
              name: 'End',
              propName: 'aggregatedData.endDate',
              id: 'edit-end-date',
              type: 'date',
            },
          ]
        },
        <DynamicFormValueBoolean>{
          name: 'Ongoing',
          propName: 'aggregatedData.isOngoing',
          id: 'edit-ongoing',
          type: 'boolean',
        },
        <DynamicFormValueTextarea>{
          name: 'Summary (optional)',
          propName: 'aggregatedData.summary',
          id: 'edit-summary',
          type: 'textarea'
        },
      ]
    };

    this.employmentSettings = new EditableListSettings();
    this.employmentSettings.dataType = PositionConnectionData;
    this.employmentSettings.rendererComponent = EmploymentDisplayComponent;
    this.employmentSettings.editorComponent = DynamicDataEditorModalComponent;
    this.employmentSettings.editorSettings = {
      title: 'Employment',
      isNew: false,
      isDeleteEnabled: true,
      formValues: [
        <DynamicFormValueText>{
          name: 'Company',
          propName: 'aggregatedData.organization.name',
          id: 'edit-organization-name',
          type: 'text',
        },
        <DynamicFormCustom>{
          type: 'custom',
          component: ImageUploadFormInputComponent,
          name: 'Logo',
          propName: 'aggregatedData.organization.logo',
          id: 'edit-organization-logo',
          data: { imageSize: 256, imageName: this.userId + '/' + this.document.id + '/[TIMECODE]' } // authenticatedUser
        },
        <DynamicFormValueText>{
          name: 'Job title',
          propName: 'aggregatedData.title',
          id: 'edit-title',
          type: 'text',
        },
        <DynamicFormGroup>{
          type: 'group',
          class: 'input-columns',
          children: [
            <DynamicFormValueDate>{
              name: 'Start',
              propName: 'aggregatedData.startDate',
              id: 'edit-start-date',
              type: 'date',
            },
            <DynamicFormValueDate>{
              name: 'End',
              propName: 'aggregatedData.endDate',
              id: 'edit-end-date',
              type: 'date',
            },
          ]
        },
        <DynamicFormValueBoolean>{
          name: 'Ongoing',
          propName: 'aggregatedData.isOngoing',
          id: 'edit-ongoing',
          type: 'boolean',
        },
        <DynamicFormValueTextarea>{
          name: 'Summary me',
          propName: 'aggregatedData.summary',
          id: 'edit-summary',
          type: 'textarea'
        },
      ]
    };

    this.gigSettings = new EditableListSettings();
    this.gigSettings.dataType = GigSourceConnectionData;
    this.gigSettings.rendererComponent = GigDataDisplayComponent;
    this.gigSettings.editorComponent = GigDataEditorComponent;
    this.gigSettings.editorSettings = {
      title: '',
      isNew: false,
      isDeleteEnabled: true
    };

    this.reviewSettings = new EditableListSettings();
    this.reviewSettings.dataType = ReviewConnectionData;
    this.reviewSettings.rendererComponent = ReviewDataDisplayComponent;
    this.reviewSettings.editorComponent = ReviewDataEditorComponent;
    this.reviewSettings.editorSettings = {
      title: '',
      isNew: false,
      isDeleteEnabled: true
    };

    this.certificateSettings = new EditableListSettings();
    this.certificateSettings.dataType = CertificateConnectionData;
    this.certificateSettings.rendererComponent = CertificateDataDisplayComponent;
    this.certificateSettings.editorComponent = CertificateDataEditorComponent;
    this.certificateSettings.editorSettings = {
      title: '',
      isNew: false,
      isDeleteEnabled: true
    };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }
}
