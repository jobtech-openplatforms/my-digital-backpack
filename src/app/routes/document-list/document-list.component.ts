import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerDataService } from '../../services/server-data.service';
import { Observable } from 'rxjs';
import { AuthenticationService, AuthenticatedUser } from '../../services/authentification.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EnterValueModalComponent } from '../../components/enter-value-modal/enter-value-modal.component';
import { UserData } from '../../datatypes/UserData';
import { DocumentData } from '../../datatypes/DocumentData';
import { HeaderService } from '../../components/header/header.service';
import { AlertModalComponent } from '../../components/alert-modal/alert-modal.component';
import { SharingModelComponent } from './sharing-modal/sharing-modal.component';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  public cvs: Observable<DocumentData[]>;

  constructor(
    private serverData: ServerDataService,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private router: Router,
    private headerService: HeaderService
  ) { }

  ngOnInit() {
    this.headerService.pageTitle = '';
    this.headerService.backRoute = '';
    this.headerService.showSharing = false;
    this.headerService.showLoggedInUser = true;

    this.authService.authenticatedUser.subscribe((authenticatedUser: AuthenticatedUser) => {
      if (authenticatedUser) {
        this.cvs = this.serverData.getCVlist(authenticatedUser.uid);
      }
    });
  }

  onAddDocument() {
    const modalData = {
      title: 'Create backpack',
      message: 'Enter a name for your backpack to start.',
      message2: `Please note that backpacks are sharable,
      this means that anyone with the link to your backpack, can see it.
      Consider all data you add as publically available.`,
      stringValue: 'My new profile',
      confirmLabel: 'Create'
    };
    const modalRef = this.modalService.open(EnterValueModalComponent);
    modalRef.componentInstance.data = modalData;
    modalRef.result.then((result) => {
      const currentUser = this.serverData.getCurrentUser().then((user: UserData) => {
        const newCV = new DocumentData();
        newCV.name = modalData.stringValue;
        newCV.created = Date.now();
        newCV.changed = Date.now();
        newCV.data.profile.name = user.name;
        newCV.data.profile.photo = user.photo;
        newCV.isPublic = true;
        newCV.owners.push(this.authService.currentUserId);
        newCV.userId = this.authService.currentUserId;

        this.serverData.createCV(newCV).then(() => {
          user.documents.push(newCV.id); // TODO: get id back in a more explicit way
          this.serverData.saveUser(user.id, user).then(() => {
            this.router.navigateByUrl('/edit-document/' + newCV.id);
          });
        });
      });
    }, (reason) => { });
  }

  onRemoveDocument(document: DocumentData) {
    this.serverData.removeCV(document.id);
  }

  onRenameDocument(document: DocumentData) {
    const modalData = {
      title: 'Profile name',
      stringValue: document.name,
      confirmLabel: 'OK'
    };
    const modalRef = this.modalService.open(EnterValueModalComponent);
    modalRef.componentInstance.data = modalData;
    modalRef.result.then((result) => {
      console.log(result);
      document.name = modalData.stringValue;
      this.serverData.saveCV(document.id, document);
    }, (reason) => { });
  }

  onShareDocument(document) {
    const modalRef = this.modalService.open(SharingModelComponent);
    (<SharingModelComponent>modalRef.componentInstance).documentId = document.id;
  }

  onEditDocument(document: DocumentData) {
    this.router.navigateByUrl('/edit-document/' + document.id);
  }
}
