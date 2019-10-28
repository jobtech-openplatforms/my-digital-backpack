import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { DataSourceAuthType } from '../datatypes/DataSourceAuthType';
import { environment } from '../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationModalComponent } from '../components/authentication-modal/authentication-modal.component';
import { ServerDataService } from './server-data.service';
import { MyCVDataInfoComponent } from '../components/my-cvdata-info/my-cvdata-info.component';
import { OrganizationData } from '../datatypes/OrganizationData';

export interface IStartPlatformEmailConnectionInfo {
  state: string;
}

export interface IStartEmailValidationInfo {
  state: string;
}

export interface IStartPlatformOauthConnectionInfo {
  state: string;
  authorizationUri: string;
}

export interface IAuthEndpointInfo {
  url: string;
}

export interface ICvDataPlatform {
  platformId: string;
  name: string;
  isManual: boolean;
  authMechanism: string;
}

export interface IUser {
  id: string;
}

export class PlatformViewModel {
  private _id: string;
  private _name: string;
  private _isManual: boolean;
  private _authMechanism?: DataSourceAuthType;

  constructor(serverModel: ICvDataPlatform) {

    this._id = serverModel.platformId;
    this._name = serverModel.name;
    this._isManual = serverModel.isManual;
    if (serverModel.authMechanism != null) {
      this._authMechanism = this.parseAuthMechanism(serverModel.authMechanism);
    }
  }

  private parseAuthMechanism(authMechanismStr: string): DataSourceAuthType {
    switch (authMechanismStr.toLowerCase()) {
      case 'email':
        return DataSourceAuthType.EmailValidation;
      case 'oauth2':
        return DataSourceAuthType.OAuthLogin;
      default:
        throw new Error(`Got unrecognized auth mechanism ${authMechanismStr}`);
    }
  }

  get id(): string { return this._id; }
  get name(): string { return this._name; }
  get isManual(): boolean { return this._isManual; }
  get authMechanism(): DataSourceAuthType { return <DataSourceAuthType>this._authMechanism; }
}

export class PlatformUserConnectionStatusViewModel {
  id: string;
  isConnected = true;
}



@Injectable({
  providedIn: 'root'
})
export class CvdataService {

  private storagePrefix = 'cvdata_';
  private _token = new Subject<string>();
  private _platformConnectionDone = new Subject<boolean>();
  private _showAuthentication = new Subject<boolean>();

  constructor(
    private readonly _serverDataService: ServerDataService,
    private readonly _httpClient: HttpClient,
    private readonly _ngbModal: NgbModal) {
    window.addEventListener('storage', this.handleStorageEvent.bind(this));
  }

  getToken(): string {
    return '' + localStorage.getItem(`${this.storagePrefix}cvdatatoken`);
  }

  get showAuthentication(): Observable<boolean> {
    return this._showAuthentication.asObservable();
  }

  get token(): Observable<string> {
    return this._token.asObservable();
  }

  setToken(token: string) {
    localStorage.setItem(`${this.storagePrefix}cvdatatoken`, token);
  }

  removeToken() {
    localStorage.removeItem(`${this.storagePrefix}cvdatatoken`);
  }

  get platformConnectionDone(): Observable<boolean> {
    return this._platformConnectionDone.asObservable();
  }

  setPlatformConnectionDone(platformId: string) {
    const key = `${this.storagePrefix}platformConnectionDone_${platformId}`;
    localStorage.setItem(key, 'true');
  }

  setAlreadyValidatedEmailAddress(emailAddress: string): Observable<void> {
    const headers = this.getHeaders();

    const body = {
      email: emailAddress,
      applicationId: environment.cvData.cvDataApplicationId,
    };

    return this._httpClient.post<void>(
      `${environment.cvData.cvDataApiBaseUrl}/user/add-validated-email-address`, body, { headers: headers }
    );
  }

  stopAuthentication(): void {
    this._showAuthentication.next(false);
  }

  startEmailAddressValidation(emailAddress: string, organization): Observable<string> {

    const body = {
      email: emailAddress,
      applicationId: environment.cvData.cvDataApplicationId
    };

    return this.makeAuthenticatedPostRequest<string>(
      '/emailvalidation/validate-email', body, organization);
  }

  getBankIdAuthorizeUrl(redirectUrl: string): Observable<string> {
    const result = new Subject<string>();
    this._httpClient
      .get<IAuthEndpointInfo>(
        `${environment.cvData.cvDataApiBaseUrl}/user/mobile-bank-id-authorization-url/` +
        `${environment.cvData.cvDataApplicationId}?redirectUrl=${redirectUrl}`
      )
      .subscribe(res => {
        result.next(res.url);
        result.complete();
      }, error => {
        result.error(error);
      });

    return result;
  }

  getUsernamePasswordAuthorizeUrl(redirectUrl: string): Observable<string> {
    const result = new Subject<string>();
    this._httpClient
      .get<IAuthEndpointInfo>(
        `${environment.cvData.cvDataApiBaseUrl}/user/username-password-authorization-url/` +
        `${environment.cvData.cvDataApplicationId}?redirectUrl=${redirectUrl}`
      )
      .subscribe(res => {
        result.next(res.url);
        result.complete();
      }, error => {
        result.error(error);
      });

    return result;
  }

  private startConnectToOAuthPlatform(
    redirectUrl: string,
    platformId: string,
    organization): Observable<IStartPlatformOauthConnectionInfo> {

    const body = {
      callbackUri: redirectUrl,
      applicationId: environment.cvData.cvDataApplicationId,
      platformId: platformId
    };

    return this.makeAuthenticatedPostRequest<IStartPlatformOauthConnectionInfo>(
      '/platformuser/start-connect-user-to-oauth-platform',
      body,
      organization);
  }

  connectEmailPlatform(platformUserEmail: string, platformId: string, organization): Observable<IStartPlatformEmailConnectionInfo> {

    const body = {
      platformUserEmailAddress: platformUserEmail,
      applicationId: environment.cvData.cvDataApplicationId,
      platformId: platformId
    };

    return this.makeAuthenticatedPostRequest('/platformuser/connect-user-to-email-platform', body, organization);
  }

  connectOAuthPlatform(platformId: string, organization): Observable<boolean> {
    const result = new Subject<boolean>();

    this.startConnectToOAuthPlatform(environment.cvData.cvDataAuthRedirectUrl, platformId, organization)
      .subscribe(platformConnectionInfo => {
        if (platformConnectionInfo.state === 'Connected') {
          // already connected
          result.next(true);
          result.complete();
        } else {
          // need to authenticate
          this.platformAuthenticate(platformConnectionInfo.authorizationUri, organization.name).subscribe(success => {
            result.next(success);
            result.complete();
          });
        }
      });

    return result;
  }

  getUserConnectionStatus(platformId: string, organization): Observable<PlatformUserConnectionStatusViewModel> {
    return this.makeAuthenticatedGetRequest<PlatformUserConnectionStatusViewModel>(
      `/platform/${platformId}/connection-status`,
      organization
    );

  }

  getAvailablePlatforms(): Observable<PlatformViewModel[]> {
    const result = new Subject<PlatformViewModel[]>();
    this._httpClient.get<ICvDataPlatform[]>(`${environment.cvData.cvDataApiBaseUrl}/platform/available`)
      .subscribe(platforms => {
        const parsedPlatforms = platforms.map(p => new PlatformViewModel(p));
        result.next(parsedPlatforms);
        result.complete();
      }, error => {
        result.error(error);
      });

    return result;
  }

  requestPlatformDataUpdateNotification(platformId: string, organization: OrganizationData): Observable<void> {
    const result = new Subject<void>();

    this.makeAuthenticatedPostRequest(`/platformuser/request-platform-data-update-notification`,
      { applicationId: environment.cvData.cvDataApplicationId, platformId: platformId }, organization)
      .subscribe(() => {
        result.next();
        result.complete();
      },
        error => result.error(error));

    return result;
  }

  private makeAuthenticatedRequestInner<TResult>(performRequestFunc: () => Observable<TResult>, organization): Observable<TResult> {

    const result = new Subject<TResult>();

    this._serverDataService.getCurrentUser().then(currentUser => {
      this.performGetRequest<IUser>('/user')
        .subscribe(user => {
          const updateUserPromise = new Promise((resolve, reject) => {
            if (currentUser.myCvDataUser !== user.id) {
              currentUser.myCvDataUser = user.id;

              this._serverDataService.saveUser(currentUser.id, currentUser)
                .then(() => {
                  resolve();
                }, reason => reject(reason));
            } else {
              resolve();
            }
          });

          updateUserPromise.then(() => {
            performRequestFunc().subscribe(res => {
              result.next(res);
              result.complete();
            }, error => result.error(error));
          });

        }, (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.authenticate<TResult>(performRequestFunc, organization)
              .subscribe(innerRes => {
                result.next(innerRes);
                result.complete();
              }, (innerError: HttpErrorResponse) => {
                result.error(innerError);
              });
          }
        });
    });

    return result;
  }

  private makeAuthenticatedGetRequest<TResult>(endpoint: string, organization: OrganizationData): Observable<TResult> {

    const result = new Subject<TResult>();

    this.makeAuthenticatedRequestInner<TResult>(() => this.performGetRequest<TResult>(endpoint), organization)
      .subscribe(res => {
        result.next(res);
        result.complete();
      }, error => result.error(error));

    return result;
  }

  private performGetRequest<TResult>(endpoint: string): Observable<TResult> {
    const headers = this.getHeaders();
    return this._httpClient.get<TResult>(`${environment.cvData.cvDataApiBaseUrl}${endpoint}`, { headers: headers });
  }

  private makeAuthenticatedPostRequest<TResult>(endpoint: string, payload: any, organization: OrganizationData): Observable<TResult> {
    const result = new Subject<TResult>();

    this.makeAuthenticatedRequestInner<TResult>(() => this.performPostRequest(endpoint, payload), organization)
      .subscribe(res => {
        result.next(res);
        result.complete();
      }, error => result.error(error));

    return result;
  }

  private performPostRequest<TResult>(endpoint: string, payload: any): Observable<TResult> {
    const headers = this.getHeaders();
    return this._httpClient.post<TResult>(`${environment.cvData.cvDataApiBaseUrl}${endpoint}`, payload, { headers: headers });
  }

  private authenticate<TResult>(func: () => Observable<TResult>, organization: OrganizationData): Observable<TResult> {
    const result = new Subject<TResult>();

    this.getUsernamePasswordAuthorizeUrl(environment.cvData.cvDataAuthRedirectUrl).subscribe(authenticationUrl => {
      const infoModalRef = this._ngbModal.open(MyCVDataInfoComponent);
      infoModalRef.componentInstance.organization = organization;
      infoModalRef.result.then(
        () => {
          const modalRef = this._ngbModal.open(AuthenticationModalComponent);
          const authenticationComponentInstance = <AuthenticationModalComponent>modalRef.componentInstance;
          authenticationComponentInstance.dialogHeading = 'Grant access to My CV Data';
          authenticationComponentInstance.authorizeUrl.next(authenticationUrl);

          this.token.subscribe(token => {
            this.makeAuthenticatedGetRequest<IUser>('/user', organization).subscribe(user => {

              this._serverDataService.getCurrentUser()
                .then(currentUser => {
                  // TODO: only save if values differ
                  currentUser.myCvDataUser = user.id;
                  this._serverDataService.saveUser(currentUser.id, currentUser)
                    .then(() => {
                      modalRef.close();
                      func().subscribe(res => {
                        result.next(res);
                        result.complete();
                      });
                    });
                });
            });
          });
        },
        () => {
          // cancelled
        });
    });

    return result;
  }

  private platformAuthenticate(oauthAuthorizeUrl: string, platformName: string): Observable<boolean> {
    const result = new Subject<boolean>();

    const modalRef = this._ngbModal.open(AuthenticationModalComponent);
    const authenticationComponentInstance = <AuthenticationModalComponent>modalRef.componentInstance;
    authenticationComponentInstance.dialogHeading = `Ge CVData tillgång till ${platformName}`;
    authenticationComponentInstance.authorizeUrl.next(oauthAuthorizeUrl);

    this._platformConnectionDone.subscribe(success => {
      modalRef.close();
      result.next(success);
      result.complete();
    }, error => {
      result.error(error);
    });

    return result;
  }

  private getHeaders(): HttpHeaders {
    const accessToken = this.getToken();
    const headers = new HttpHeaders({
      accept: 'application/json',
      authorization: `Bearer ${accessToken}`
    });

    return headers;
  }

  private handleStorageEvent = (event: StorageEvent): void => {

    const key = event.key || '';
    if (!key.startsWith(this.storagePrefix)) {
      return;
    }

    if (key === `${this.storagePrefix}cvdatatoken`) {
      this._token.next('' + event.newValue);
    }

    if (key.startsWith(`${this.storagePrefix}platformConnectionDone_`)) {
      // this is a platform connection done event signal.
      this._platformConnectionDone.next(true);
      localStorage.removeItem(key);
    }
  }
}

