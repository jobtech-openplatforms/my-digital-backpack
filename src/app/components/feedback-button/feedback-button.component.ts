import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FeedbackModalComponent } from '../feedback-modal/feedback-modal.component';

@Component({
  selector: 'app-feedback-button',
  templateUrl: './feedback-button.component.html',
  styleUrls: ['./feedback-button.component.css']
})
export class FeedbackButtonComponent implements OnInit {

  constructor(private modal: NgbModal) { }

  ngOnInit() {
  }

  onClick() {
    this.modal.open(FeedbackModalComponent);
  }

}
