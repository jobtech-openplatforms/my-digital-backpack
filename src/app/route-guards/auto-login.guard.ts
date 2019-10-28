import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthenticationService, AuthenticatedUser } from '../services/authentification.service';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanActivate {
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private auth: AuthenticationService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
      // this route gurad is used only on login page to auto-login (currently going to list page)
      this.afAuth.authState.pipe(first()).subscribe((u) => {
        const authResult = <AuthenticatedUser>u;
        console.log(authResult);
        if (authResult) {
          if (authResult.emailVerified) {
            this.router.navigate(['/list']);
            resolve(false); // logged in and email verified = auto redirect to list page
          } else {
            resolve(true);
          }
        } else {
          resolve(true); // not logged in
        }
      });
    });



  }
}
