import { Component, OnInit, NgZone } from '@angular/core';
import { Utility } from '../../../utils/Utility';
import * as log from 'loglevel';
import { EmailVerificationModalComponent } from '../email-verification-modal/email-verification-modal.component';
import { AuthenticationService } from '../../../services/authentification.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {
    public loginState = 'login';
    public password = '';
    public repeatPassword = '';
    public email = '';
    public name = '';
    public loginErrorMessage = '';
    public resetSuccessMessage = '';
    public resetErrorMessage = '';
    public createErrorMessage = '';

    constructor(
        private auth: AuthenticationService,
        private modalService: NgbModal,
        private router: Router,
        private ngZone: NgZone) {
    }

    ngOnInit() {

    }

    onLoginGoogle() {
        this.auth.loginGoogle().then(() => {
            log.debug('Google login successful');
            this.ngZone.run(() => { this.continueToApp(); });
        });
    }

    onLoginFacebook() {
        this.auth.loginFacebook().then(() => {
            log.debug('Facebook login successful');
            this.ngZone.run(() => { this.continueToApp(); });
        });
    }

    onCreateAccount(email, password) {
        this.createErrorMessage = '';
        if (this.name.length < 3) {
            this.createErrorMessage = 'You need to enter a name';
            return;
        }
        if (Utility.validateEmail(this.email) === false) {
            this.createErrorMessage = 'Not valid email adress';
            return;
        }
        if (this.password.length < 6) {
            this.createErrorMessage = 'Password needs to be at least 6 characters';
            return;
        }
        if (this.password !== this.repeatPassword) {
            this.createErrorMessage = 'Password fields must match';
            return;
        }
        this.auth.createUser(this.name, this.email, this.password).then(
            () => {
                log.debug('user created');
                const modalRef = this.modalService.open(EmailVerificationModalComponent, { backdrop: 'static' });
                modalRef.componentInstance.email = email;
                modalRef.componentInstance.auth = this.auth;
            },
            (e) => {
                this.createErrorMessage = 'Sign-up failed: ' + e.message;
                log.error('create user failed', e);
            }

        );
    }

    onLoginPassword() {
        this.loginErrorMessage = '';
        if (Utility.validateEmail(this.email) === false) {
            this.loginErrorMessage = 'Not valid email adress';
            return;
        }
        if (this.password === '') {
            this.loginErrorMessage = 'You need to supply a password';
            return;
        }
        this.auth.loginPassword(this.email, this.password).then(
            () => {
                log.debug('Email login successful');
                this.continueToApp();
            },
            (e) => {
                this.loginErrorMessage = 'Login failed: ' + e.message;
                log.error('login failed', e);
            }
        );
    }

    onResetPassword() {
        this.resetErrorMessage = '';
        if (Utility.validateEmail(this.email) === false) {
            this.resetErrorMessage = 'Not valid email adress';
            return;
        }
        this.auth.resetPassword(this.email).then(
            () => {
                log.debug('reset complete');
                this.resetSuccessMessage = 'A reset email has been sent!';
                this.loginState = 'login';
            },
            (e) => {
                this.resetErrorMessage = 'Reset failed: ' + e;
                log.error('reset failed', e);
            }
        );
    }

    continueToApp() {
        console.log('continue to app');
        if (this.auth.originalRoute !== '') {
            this.router.navigate([this.auth.originalRoute]);
            this.auth.originalRoute = '';
        } else {
            this.router.navigate(['/list']);
        }
    }

}
