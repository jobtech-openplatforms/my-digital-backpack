import { ContentChild, Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { ItemBase } from '../../datatypes/ItemBase';
import { CommandBase } from '../../datatypes/CommandBase';
import { DisplaySettingsBase } from '../../datatypes/DisplaySettingsBase';
import { DataSourceConnectionData } from '../../datatypes/DataSourceConnectionData';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import {
  DynamicEditorSettings, DynamicDataEditorModalComponent
} from '../../components/dynamic-data-editor-modal/dynamic-data-editor-modal.component';
import { ServerDataService } from '../../services/server-data.service';
import { Utility } from '../../utils/Utility';
import { Observable } from 'rxjs';
import { ValidateEmailModalComponent } from '../validate-email-modal/validate-email-modal.component';
import { ManualDataValidationModalComponent } from '../manual-data-validation-modal/manual-data-validation-modal.component';
import { AuthenticationService } from '../../services/authentification.service';
import { DynamicFormValueText } from '../dynamic-form/dynamic-form.component';
import { SynchedItem } from '../../../app/routes/edit-document/SynchedItem';

@Component({
  selector: 'app-editable-list',
  templateUrl: './editable-list.component.html',
  styleUrls: ['./editable-list.component.css']
})
export class EditableListComponent implements OnInit {
  static ADD_NEW_ITEM_CONSTANT = 'ADD_NEW_ITEM_CONSTANT';

  @Input()
  dataSources: Array<string>;

  @Input()
  isEditable = true;

  @Input()
  sortOn = '';

  @Output()
  change = new EventEmitter();

  @Output()
  editCategory = new EventEmitter();

  @Input()
  title = '';

  @Input()
  addLabel = 'Add item';

  @Input()
  emptyText = '';

  @Input()
  listSettings: EditableListSettings;

  @ContentChild(TemplateRef)
  itemTemplate: TemplateRef<any>;


  constructor(private modalService: NgbModal, private auth: AuthenticationService, private serverData: ServerDataService) { }

  ngOnInit() {
    // if list contains add-new-item-constand auto-open add item modal
    if (this.dataSources.length === 1 && this.dataSources[0] === EditableListComponent.ADD_NEW_ITEM_CONSTANT) {
      this.dataSources.splice(0, 1);
      setTimeout(() => { this.onAddItem(); }, 0);
    }
    this.dataSources.forEach((id) => { this.addSynchItem(id); });
  }

  getSynchedItem(id) {
    if (!SynchedItem.cache[id]) {
      setTimeout(() => {
        this.addSynchItem(id);
      }, 0);
    }
    return SynchedItem.cache[id].targetObj;
  }

  addSynchItem(id, initialData = null) { // TODO: remove synch items on removal and on ng-destroy
    const target = <ItemBase>{ id: id, dataVersion: 0, owners: [], status: 'incomplete' };
    if (initialData) {
      Utility.replaceObject(target, initialData);
    }
    const synchItem = new SynchedItem(id, this.serverData.getDataSourceObs(id), target);
    // this.onSort();
  }

  removeSynchItem(id) {
    SynchedItem.cache[id].dispose();
  }

  onEditCategory() {
    if (this.isEditable === false) {
      return;
    }
    this.editCategory.emit();
  }

  onAddItem() {
    const modalOptions: NgbModalOptions = {
      backdrop: 'static'
    };

    const newItem = new this.listSettings.dataType();
    const modalRef = this.modalService.open(this.listSettings.editorComponent, modalOptions);
    modalRef.componentInstance.data = newItem;
    modalRef.componentInstance.currentItems = this.dataSources.map(id => this.getSynchedItem(id));
    this.listSettings.editorSettings.isNew = true;
    modalRef.componentInstance.editorSettings = this.listSettings.editorSettings;
    modalRef.result.then((result) => {
      this.serverData.createDataSource(newItem).then(() => {
        this.addSynchItem(newItem.id, newItem);
        this.dataSources.push(newItem.id);
        this.change.emit(null);
        this.handleExtraSaveSettings(result, newItem);

        if (result.postOpFn != null) {
          result.postOpFn();
        }
      });
    }, (error) => {

    });
  }

  onEdit(itemId) {
    if (this.isEditable === false) {
      return;
    }

    const item = this.getSynchedItem(itemId);
    let clonedData: DataSourceConnectionData<ItemBase, DisplaySettingsBase> = JSON.parse(JSON.stringify(item));

    const modalOptions: NgbModalOptions = {
      backdrop: 'static'
    };

    const modalRef = this.modalService.open(this.listSettings.editorComponent, modalOptions);
    modalRef.componentInstance.data = clonedData;
    modalRef.componentInstance.currentItems = this.dataSources.map(id => this.getSynchedItem(id));
    this.listSettings.editorSettings.isNew = false;
    modalRef.componentInstance.editorSettings = this.listSettings.editorSettings;
    modalRef.result.then((result) => {
      console.log('edit result', result);

      if (result.type === 'Delete') {
        this.dataSources.splice(this.dataSources.indexOf(itemId), 1);
        // TODO: also handle removing data from database (needs ref from all CVs it's used in)
        this.change.emit(null);
        this.removeSynchItem(itemId);
        this.serverData.removeDataSource(itemId);

      } else if (result.type === 'Save') {
        if (clonedData.isValidated) { // can only update displaysettings when data is validated (firebase rules)
          clonedData = <any>{
            id: clonedData.id,
            displaySettings: clonedData.displaySettings
          };
        }
        this.serverData.saveDataSource(clonedData.id, clonedData);
        this.change.emit();
        this.handleExtraSaveSettings(result, clonedData);
      }

    }, (error) => {
      console.log('cancel', error);
    });
  }

  handleExtraSaveSettings(saveSettings, data) { // TODO: type save settings
    if (saveSettings.askForManualValidation === true) {
      const modalRef = this.modalService.open(ManualDataValidationModalComponent);
      const modalInstance = <ManualDataValidationModalComponent>modalRef.componentInstance;
      modalInstance.data = data;
      modalInstance.email = this.auth.currentUserEmail; // TODO: make sure it's the last used email no platform
      modalRef.result.then((result) => { }, (error) => { });
      // this.dataSources.requestVerificationByEmail( // TODO: also handle email verification
      //   this.data.sourceId, this.validateFormData.email, this.validateFormData.profileUrl
      // ).then((requiredEmailValidation) => { });
      return;
    }

    if (saveSettings.newCustomDataSource === true) {
      const command: CommandBase = {
        type: 'NewDataSourceNotification',
        data: {
          email: this.auth.currentUserEmail,
          dataSourceId: data.id
        }
      };
      this.serverData.createServerCommand(command);
    }

    if (saveSettings.confirmReview === true) {
      const command: CommandBase = {
        type: 'ValidateReview',
        data: {
          dataSourceId: data.id,
          reviewId: data.aggregatedData.id
        }
      };
      this.serverData.createServerCommand(command);
    }
    if (saveSettings.confirmCertificate === true) {
      const command: CommandBase = {
        type: 'ValidateCertificate',
        data: {
          dataSourceId: data.id,
          certificateId: data.aggregatedData.id
        }
      };
      this.serverData.createServerCommand(command);
    }

    if (saveSettings.requireEmailValidation === true) {
      const modalRef = this.modalService.open(ValidateEmailModalComponent);
      modalRef.componentInstance.email = ''; // TODO: make sure it's the last used email no platform
      modalRef.result.then((result) => { }, (error) => { });
      return;
    }
  }
}

export class EditableListSettings {
  dataType: any;
  rendererComponent: any;
  editorComponent: any;
  editorSettings?: DynamicEditorSettings;
}
