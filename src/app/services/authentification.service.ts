import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Observable, BehaviorSubject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailVerificationModalComponent } from '../routes/start/email-verification-modal/email-verification-modal.component';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private authenticatedUserSubject = new BehaviorSubject<AuthenticatedUser | null>(null);
  public authenticatedUser: Observable<AuthenticatedUser | null>;
  public isAuthInited = false;
  public currentUserId = '';
  public currentUserEmail = '';

  public originalRoute = '';

  constructor(
    private afAuth: AngularFireAuth,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.authenticatedUser = this.authenticatedUserSubject.asObservable();
    this.init();
  }

  init() {
    this.afAuth.authState.subscribe((u) => {
      this.isAuthInited = true;
      const authResult = <AuthenticatedUser>u;
      if (authResult) {
        if (u.emailVerified) {
          console.log('Logged in as ', authResult.email, authResult.uid, u.emailVerified);
          this.currentUserId = authResult.uid;
          this.currentUserEmail = authResult.email;
          this.authenticatedUserSubject.next(<AuthenticatedUser>authResult);
        }
      } else {
        console.log('Logged out');
        this.currentUserId = '';
        this.currentUserEmail = '';
        this.authenticatedUserSubject.next(null);
      }
    });
  }

  public loginGoogle() {
    return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  public loginFacebook() {
    return this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider());
  }

  public showEmailVerificationNotice(email) {
    const modalRef = this.modalService.open(EmailVerificationModalComponent, { backdrop: 'static' });
    modalRef.componentInstance.email = email;
    modalRef.componentInstance.auth = this;
  }

  public createUser(name, email, password, photoUrl = '') {
    const promise = this.afAuth.auth.createUserWithEmailAndPassword(email, password);

    promise.then(() => {
      const user = this.afAuth.auth.currentUser;
      user.updateProfile({ displayName: name, photoURL: photoUrl }).then(
        () => {
          user.sendEmailVerification();
        },
        (error) => {
          console.error('Set user name failed', error);
        }
      );
    });

    return promise;
  }

  public loginPassword(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  public resetPassword(email) {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  public sendEmailVerification() {
    if (this.afAuth.auth.currentUser) {
      return this.afAuth.auth.currentUser.sendEmailVerification();
    }
    return null;
  }

  public updateUserProfile(name, photoUrl) {
    const user = this.afAuth.auth.currentUser;
    user.updateProfile({ displayName: name, photoURL: photoUrl });
  }

  public logout() {
    const logout = this.afAuth.auth.signOut();
    logout.then(() => {
      this.router.navigate(['/']);
    });
    return logout;
  }
}

export interface AuthenticatedUser {
  displayName: string;
  uid: string;
  photoURL: string;
  email: string;
  emailVerified: boolean;
}
