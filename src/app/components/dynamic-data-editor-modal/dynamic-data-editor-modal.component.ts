import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  DynamicFormValueBase, DynamicFormItemBase
} from '../dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-education-editor',
  templateUrl: './dynamic-data-editor-modal.component.html',
  styleUrls: ['./dynamic-data-editor-modal.component.css']
})
export class DynamicDataEditorModalComponent implements OnInit {

  @Input()
  data: any;

  @Input()
  editorSettings: DynamicEditorSettings;

  isChanged = false;

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {

  }

  onChange() {
    this.isChanged = true;
  }

  onDelete() {
    this.activeModal.close({ type: 'Delete' });
  }

  onConfirm = (form) => {
    this.activeModal.close({ type: 'Save' });
  }

  onCancel() {
    this.activeModal.dismiss();
  }

}

export class DynamicEditorSettings {
  title: string;
  isNew: boolean;
  isDeleteEnabled: boolean;
  formValues?: DynamicFormItemBase[];
  customData?: any;
}
