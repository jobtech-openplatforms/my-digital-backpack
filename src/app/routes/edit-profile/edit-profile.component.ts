import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerDataService } from '../../services/server-data.service';
import { AuthenticationService, AuthenticatedUser } from '../../services/authentification.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { UserData } from '../../datatypes/UserData';
import { HeaderService } from '../../components/header/header.service';

@Component({
  selector: 'app-onboarding',
  templateUrl: 'edit-profile.component.html',
  styleUrls: ['edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  public userData: UserData;

  public photoFileName = '';
  public invitecode = '';
  public inviteError = '';
  public isInviteValidated = false;
  public isNewUser = false;

  constructor(
    private authService: AuthenticationService,
    private serverData: ServerDataService,
    private afStorage: AngularFireStorage,
    private router: Router,
    private headerService: HeaderService
  ) {
  }

  ngOnInit() {
    this.isNewUser = this.router.url.indexOf('new-user') > -1;

    if (this.isNewUser) {
      this.headerService.pageTitle = '';
      this.headerService.backRoute = '';
      this.headerService.showLoggedInUser = true;
    } else {
      this.headerService.pageTitle = 'Edit profile';
      this.headerService.showLoggedInUser = true;
      this.headerService.backRoute = '/list';
    }
    this.headerService.showSharing = false;

    this.authService.authenticatedUser.subscribe((authenticatedUser: AuthenticatedUser) => {
      if (authenticatedUser) {
        this.serverData.getCurrentUser().then((userData: UserData) => {
          this.userData = userData;
          this.photoFileName = this.userData.id + '/profile-image';
        });
      }
    });
  }

  onValidateInvite = () => {
    this.inviteError = '';
    const promise = this.serverData.validateInviteCode(this.invitecode);
    promise.then(
      () => {
        console.log('invite was validated');
        this.isInviteValidated = true;
      },
      () => {
        console.log('invite was not validated');
        this.inviteError = `Could not validate code.
        Please check that you are using a correct code
        and that you are connected to the internet.`;
      }
    );
    return promise;
  }

  public onPhotoChanged(url) {
    this.userData.photo = url;
  }

  public onSaveProfile = () => {
    if (!this.userData.settings) {
      this.userData.settings = {
        createdProfile: true
      };
    }
    this.userData.settings.createdProfile = true;

    const saveDone = this.serverData.saveUser(this.userData.id, this.userData);
    saveDone.then(() => {
      this.router.navigateByUrl('/list');
    });
    return saveDone;
  }

  public onLogout() {
    this.authService.logout();
  }
}
