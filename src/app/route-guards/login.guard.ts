import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthenticationService, AuthenticatedUser } from '../services/authentification.service';
import { first } from 'rxjs/operators';
import { ServerDataService } from '../services/server-data.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private auth: AuthenticationService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
      this.afAuth.authState.pipe(first()).subscribe((u) => {
        const authResult = <AuthenticatedUser>u;
        if (authResult) {
          if (authResult.emailVerified) {
            resolve(true); // logged in and email verified
          } else {
            this.redirect('/start', state.url);
            this.auth.showEmailVerificationNotice(authResult.email); // logged in but email not verified
            resolve(false);
          }
        } else {

          this.redirect('/start', state.url);
          resolve(false); // not logged in
        }
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
