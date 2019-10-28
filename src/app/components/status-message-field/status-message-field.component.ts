import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UIMessageService, UIMessageData } from '../../services/uimessage.service';

@Component({
  selector: 'app-status-message-field',
  templateUrl: './status-message-field.component.html',
  styleUrls: ['./status-message-field.component.css']
})
export class StatusMessageFieldComponent implements OnInit, OnDestroy {
  @Input()
  uiMessageChannel = 'global';

  message;
  type;
  subscription;

  constructor(private uiMessage: UIMessageService) { }

  ngOnInit() {
    this.subscription = this.uiMessage.messagesUpdates.subscribe((data: UIMessageData) => {
      if (data && data.channel === this.uiMessageChannel) {
        this.message = data.message;
        this.type = data.type;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
