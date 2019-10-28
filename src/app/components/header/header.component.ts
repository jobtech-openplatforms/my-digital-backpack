import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { AuthenticationService, AuthenticatedUser } from '../../services/authentification.service';
import { ServerDataService } from '../../services/server-data.service';
import { UserData } from '../../datatypes/UserData';
import { HeaderService } from './header.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharingModelComponent } from '../../routes/document-list/sharing-modal/sharing-modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public userData;
  public loginStatus = -1;

  constructor(
    private authService: AuthenticationService,
    public header: HeaderService,
    private serverData: ServerDataService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.authService.authenticatedUser.subscribe((authenticatedUser: AuthenticatedUser) => {
      if (authenticatedUser) {
        this.serverData.getUserObservable(authenticatedUser.uid).subscribe(
          (userData: UserData) => {
            console.log('Got updated user data');
            this.userData = userData;
          },
          (userData: UserData) => {
            this.userData = null;
          }
        );
      } else {
        this.userData = null;
      }
    });
  }

  onSharing() {
    const modalRef = this.modalService.open(SharingModelComponent);
    const modal = <SharingModelComponent>modalRef.componentInstance;
  }

  onHome() {
    // this.router.navigateByUrl('/start');
  }

  onBack() {
    this.router.navigateByUrl(this.header.backRoute);
  }

  onLogin() {
    this.authService.loginGoogle();
  }

  onLogout() {
    this.authService.logout();
  }

  onEditProfile() {
    this.router.navigateByUrl('/edit-profile');
  }

}
