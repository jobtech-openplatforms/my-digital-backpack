import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription, BehaviorSubject } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-authentication-modal',
  templateUrl: './authentication-modal.component.html',
  styleUrls: ['./authentication-modal.component.css']
})
export class AuthenticationModalComponent implements OnInit, OnDestroy {

  @Input()
  authorizeUrl = new BehaviorSubject<string>('');

  @Input()
  dialogHeading = '';

  showIframe = false;
  safeAuthorizeUrl: SafeResourceUrl = '';

  private _subscriptions: Subscription[] = [];

  constructor(private readonly _activateModal: NgbActiveModal,
    private readonly _domSanitizer: DomSanitizer) { }

  ngOnInit() {

    const subscription = this.authorizeUrl.subscribe((authUrl: string) => {
      if (authUrl != null && authUrl !== '') {
        this.safeAuthorizeUrl = this._domSanitizer.bypassSecurityTrustResourceUrl(authUrl);
        this.showIframe = true;
      }
    });

    this._subscriptions.push(subscription);
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(s => s.unsubscribe());
  }

  onCancel(): void {
    this._activateModal.close();
  }
}
