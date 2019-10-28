import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UIMessageService {
  private messagesSubject = new Subject<UIMessageData>();
  public messagesUpdates = this.messagesSubject.asObservable();

  constructor() { }

  broadCast(message: UIMessageData) {
    this.messagesSubject.next(message);
  }
}

export interface UIMessageData {
  channel: string;
  type: 'error' | 'info' | '';
  message: string;
}
