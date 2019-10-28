import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-enter-value-modal',
    templateUrl: 'enter-value-modal.component.html',
})

export class EnterValueModalComponent implements OnInit {
    @Input() data: {
        title: string,
        message?: string,
        message2?: string,
        stringValue: string,
        confirmLabel: string,
        dismissLabel?: string
        type?: InputType
    };

    public errorMessage = '';

    constructor(private activeModal: NgbActiveModal, private changeDetector: ChangeDetectorRef) {
    }

    ngOnInit() {
        if (!this.data.type) {
            this.data.type = <InputType>'text';
        }
    }

    validateEmail(email: string) {
        // tslint:disable-next-line:max-line-length
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
    }

    onConfirm() {
        this.errorMessage = '';
        if (this.data.type === 'email' && this.validateEmail(this.data.stringValue) === false) {
            this.errorMessage = 'Please enter a valid email adress';
            return;
        }
        if (this.data.stringValue.length === 0) {
            this.errorMessage = 'Please enter something';
            return;
        }

        this.activeModal.close();
    }

    onCancel() {
        this.activeModal.dismiss();
    }
}

export type InputType = 'text' | 'number' | 'email' | 'password';
