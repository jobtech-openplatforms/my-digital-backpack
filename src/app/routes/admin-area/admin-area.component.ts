import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { UserData } from 'src/app/datatypes/UserData';
import { DocumentData } from 'src/app/datatypes/DocumentData';
import { UserResources } from 'src/app/datatypes/UserResources';
import { ItemBase } from 'src/app/datatypes/ItemBase';
import { DisplaySettingsBase } from 'src/app/datatypes/DisplaySettingsBase';
import { DataSourceConnectionData } from 'src/app/datatypes/DataSourceConnectionData';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DynamicDataEditorModalComponent } from 'src/app/components/dynamic-data-editor-modal/dynamic-data-editor-modal.component';
import { DynamicFormValueText, DynamicFormValueNumber } from 'src/app/components/dynamic-form/dynamic-form.component';
import { EnterValueModalComponent } from 'src/app/components/enter-value-modal/enter-value-modal.component';
import { ServerDataService } from 'src/app/services/server-data.service';

@Component({
  selector: 'app-admin-area',
  templateUrl: './admin-area.component.html',
  styleUrls: ['./admin-area.component.css']
})
export class AdminAreaComponent implements OnInit {
  public tokensCollection: AngularFirestoreCollection;
  public usersCollection: AngularFirestoreCollection<UserData>;
  public documentsCollection: AngularFirestoreCollection<DocumentData>;
  public dataSourcesCollection: AngularFirestoreCollection<DataSourceConnectionData<ItemBase, DisplaySettingsBase>>;
  public userResourcesCollection: AngularFirestoreCollection<UserResources>;

  public deleteProgressMessage = '';

  constructor(
    private modalService: NgbModal,
    private afFirestore: AngularFirestore,
    private serverData: ServerDataService
  ) {
    this.tokensCollection = afFirestore.collection<UserData>('tokens');
    this.usersCollection = afFirestore.collection<UserData>('users');
    this.documentsCollection = afFirestore.collection<DocumentData>('documents');
    this.userResourcesCollection = afFirestore.collection<UserResources>('userResources');
    this.dataSourcesCollection = this.afFirestore.collection('dataSources');
  }

  ngOnInit() {
  }

  onCreateInvites = () => {
    const invitesData = { code: '', amount: 1 };
    const editorSettings = {
      title: 'Create invite code',
      isNew: false,
      isDeleteEnabled: false,
      formValues: [
        <DynamicFormValueText>{
          name: 'Invite Code',
          propName: 'code',
          required: true,
          type: 'text',
        },
        <DynamicFormValueNumber>{
          name: 'No of invites',
          valueMin: 1,
          valueMax: 100,
          valueStep: 1,
          required: true,
          propName: 'amount',
          type: 'number',
        }
      ]
    };
    const modalRef = this.modalService.open(DynamicDataEditorModalComponent);
    const modalComponent = (<DynamicDataEditorModalComponent>modalRef.componentInstance);
    modalComponent.data = invitesData;
    modalComponent.editorSettings = editorSettings;
    modalRef.result.then(
      () => {
        this.tokensCollection.doc(invitesData.code).set({ type: 'invite', left: invitesData.amount }).then(() => {
          alert('Invites created');
        });
      },
      () => { }
    );
  }

  onDeleteUser() {
    const modalRef = this.modalService.open(EnterValueModalComponent);
    const modalComponent = (<EnterValueModalComponent>modalRef.componentInstance);
    const modalData = {
      title: 'Enter user id',
      confirmLabel: 'Delete all data', dismissLabel:
        'Cancel',
      type: <any>'text',
      stringValue: 'userid'
    };
    modalComponent.data = modalData;
    modalRef.result.then(() => {
      const command = {
        type: 'RemoveUser',
        data: { targetId: modalData.stringValue }
      };
      this.deleteProgressMessage = 'User deletion in progress';
      this.serverData.createServerCommand(command, true).then(
        () => {
          this.deleteProgressMessage = 'User data deleted';
        },
        () => {
          this.deleteProgressMessage = 'Failed to delete user data';
        });
    });
  }

}
