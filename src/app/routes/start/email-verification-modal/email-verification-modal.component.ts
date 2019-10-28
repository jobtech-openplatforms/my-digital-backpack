import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-email-verification-modal',
    templateUrl: './email-verification-modal.component.html',
    encapsulation: ViewEncapsulation.None
})
export class EmailVerificationModalComponent implements OnInit {
    @Input()
    public email: string;

    public sentEmail = false;

    @Input()
    public auth: any; // TODO: neded to avoid circular dependency

    constructor() {
    }

    ngOnInit() {

    }

    onSendNew() {
        const result = this.auth.sendEmailVerification();
        if (result) {
            result.then(() => {
                this.sentEmail = true;
            });
        }
    }

    onReload() {
        window.location.reload();
    }

    onCancel() {
        this.auth.logout();
    }

}
