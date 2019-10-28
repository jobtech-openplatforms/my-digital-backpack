import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-alert-modal',
    templateUrl: 'alert-modal.component.html',
    styleUrls: ['alert-modal.component.css']
})
export class AlertModalComponent implements OnInit {
    @Input() title: string;
    @Input() message = 'Message';
    @Input() confirmLabel = 'OK';
    @Input() dismissLabel: string;

    constructor(private activeModal: NgbActiveModal) {
    }

    ngOnInit() {
    }

    onConfirm() {
        this.activeModal.close();
    }

    onCancel() {
        this.activeModal.dismiss();
    }

}
