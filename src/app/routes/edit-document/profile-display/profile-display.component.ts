import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProfileData } from '../../../datatypes/ProfileData';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  DynamicFormValueText, DynamicFormValueTextarea,
  DynamicFormValueDate, DynamicFormValueBoolean, DynamicFormCustom
} from '../../../components/dynamic-form/dynamic-form.component';
import { Utility } from '../../../utils/Utility';
import {
  DynamicEditorSettings,
  DynamicDataEditorModalComponent
} from '../../../components/dynamic-data-editor-modal/dynamic-data-editor-modal.component';
import { ImageUploadFormInputComponent } from '../../../components/image-upload-form-input/image-upload-form-input.component';

@Component({
  selector: 'app-cv-profile-display',
  templateUrl: './profile-display.component.html',
  styleUrls: ['./profile-display.component.css']
})
export class ProfileDisplayComponent implements OnInit {
  @Input()
  data: ProfileData;

  @Input()
  userId: '';

  @Input()
  documentId: '';

  @Input()
  isEditable = false;

  @Output()
  change = new EventEmitter();

  private editorSettings: DynamicEditorSettings;

  constructor(private modalService: NgbModal) { }

  ngOnInit() {

  }

  getAge() {
    if (!this.data.birthdate) {
      return '';
    }
    return new Date().getFullYear() - new Date(this.data.birthdate).getFullYear();
  }

  onEdit() {
    if (this.isEditable === false) {
      return;
    }
    console.log('onEdit');
    this.editorSettings = {
      title: 'Profile',
      isNew: false,
      isDeleteEnabled: false,
      formValues: [
        <DynamicFormValueText>{
          name: 'Name',
          propName: 'name',
          id: 'edit-name',
          type: 'text',
          required: true
        },
        <DynamicFormCustom>{
          type: 'custom',
          component: ImageUploadFormInputComponent,
          name: 'Photo',
          id: 'edit-photo',
          propName: 'photo',
          data: { url: 'photo', imageSize: 256, imageName: this.userId + '/' + this.documentId + '/profile-image01' } // authenticatedUser
        },
        <DynamicFormValueText>{
          name: 'Title',
          propName: 'title',
          id: 'edit-title',
          type: 'text'
        },
        <DynamicFormValueText>{
          name: 'Location',
          propName: 'location.city',
          id: 'edit-location',
          type: 'text'
        },
        <DynamicFormValueDate>{
          name: 'Birth date',
          propName: 'birthdate',
          id: 'edit-birthdate',
          type: 'date',
        },
        <DynamicFormValueTextarea>{
          name: 'Summary',
          propName: 'summary',
          id: 'edit-summary',
          type: 'textarea',
        }
      ]
    };

    const modalRef = this.modalService.open(DynamicDataEditorModalComponent);
    const clonedData = JSON.parse(JSON.stringify(this.data));
    modalRef.componentInstance.data = clonedData;
    this.editorSettings.isNew = false;
    this.editorSettings.isDeleteEnabled = false;
    modalRef.componentInstance.editorSettings = this.editorSettings;
    modalRef.result.then((result) => {
      if (result.type === 'Save') {
        Utility.replaceObject(this.data, clonedData);
        this.data = clonedData;
        this.change.emit(null);
      }
    }, (error) => {
      console.log('cancel', error);
    });
  }
}
