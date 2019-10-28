import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthenticationService, AuthenticatedUser } from '../services/authentification.service';
import { first } from 'rxjs/operators';
import { ServerDataService } from '../services/server-data.service';
import { UserData } from '../datatypes/UserData';

@Injectable({
  providedIn: 'root'
})
export class NewUserGuard implements CanActivate {
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private serverData: ServerDataService,
    private auth: AuthenticationService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return new Promise((resolve, reject) => {
      this.afAuth.authState.pipe(first()).subscribe((u) => { // hack to make sure auth is initialised first
        this.serverData.getCurrentUser().then(
          (userData) => {
            if (userData
              && userData.settings
              && userData.settings.createdProfile === true) {
              resolve(true);
            } else {
              this.redirect('/new-user', state.url);
              resolve(false); // not logged in
            }
          },
          () => {
            this.redirect('/new-user', state.url);
            resolve(false); // not logged in
          }
        );
      });
    });

  }
  redirect(route, originalUrl) {
    if (this.auth.originalRoute === '') {
      this.auth.originalRoute = originalUrl;
    }
    this.router.navigate([route]);
  }
}
