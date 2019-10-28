import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UIMessageService } from '../../services/uimessage.service';

@Component({
  selector: 'app-submit-button',
  templateUrl: './submit-button.component.html',
  styleUrls: ['./submit-button.component.css']
})
export class SubmitButtonComponent implements OnInit {
  @Input()
  label = 'Submit';

  @Input()
  submit: () => Promise<any>;

  @Input()
  showMessages = false;

  @Input()
  errorMessage = 'Something went wrong.';

  @Input()
  invalidMessage = 'Some fields are not valid.';

  @Input()
  loadingMessage = 'Sending...';

  @Input()
  completeMessage = 'Successfully submitted';

  @Input()
  customClass = '';

  @Input()
  enableMultiple = false;

  @Input()
  form: NgForm;

  @Input()
  uiMessageChannel = 'global';

  myLabel = '';
  message = '';
  messageType: 'error' | 'info' | '' = '';
  enabled = true;
  isInProgress = false;
  isCompleted = false;

  constructor(private uiMessage: UIMessageService) { }

  ngOnInit() {
    this.myLabel = this.label;
  }

  onSetMessage(type, message) {
    if (this.showMessages === true) {
      this.messageType = type;
      this.message = message;
    }
    this.uiMessage.broadCast({ type: type, message: message, channel: this.uiMessageChannel });
  }

  onSubmit() {
    if (this.submit) {
      this.onSetMessage('', '');

      if (this.form && this.form.valid === false) {
        this.form.onSubmit(null);
        for (const p in this.form.controls) {
          if (this.form.controls.hasOwnProperty(p)) {
            const control = this.form.controls[p];
            control.markAsDirty();
            control.markAsTouched();
          }
        }
        this.onSetMessage('error', this.invalidMessage);
        return;
      }

      this.enabled = false;
      this.isInProgress = true;
      this.onSetMessage('info', this.loadingMessage);

      const promise = this.submit();
      if (promise instanceof Promise) {
        promise.then(
          () => {
            if (this.enableMultiple) {
              this.enabled = true;
            }
            this.isInProgress = false;
            this.isCompleted = true;
            this.onSetMessage('info', this.completeMessage);
          },
          (e) => {
            this.enabled = true;
            this.isInProgress = false;
            this.onSetMessage('error', this.errorMessage + ' ' + e);
          }
        );
      } else {
        this.enabled = this.enableMultiple;
        this.isInProgress = false;
        this.isCompleted = true;
        this.onSetMessage('info', this.completeMessage);
      }

    } else {
      throw new Error('No submit function defined');
    }
  }
}
