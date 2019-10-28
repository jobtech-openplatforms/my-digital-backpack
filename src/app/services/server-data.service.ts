import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { first, take } from 'rxjs/operators';
import { AuthenticationService, AuthenticatedUser } from './authentification.service';
import { ItemBase } from '../datatypes/ItemBase';
import { CommandBase } from '../datatypes/CommandBase';
import { UserResources } from '../datatypes/UserResources';
import { UserData } from '../datatypes/UserData';
import { DisplaySettingsBase } from '../datatypes/DisplaySettingsBase';
import { DataSourceConnectionData } from '../datatypes/DataSourceConnectionData';
import { DocumentData } from '../datatypes/DocumentData';
import { Utility } from '../utils/Utility';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServerDataService {
  public usersCollection: AngularFirestoreCollection<UserData>;
  public cvsCollection: AngularFirestoreCollection<DocumentData>;
  public dataSourcesCollection: AngularFirestoreCollection<DataSourceConnectionData<ItemBase, DisplaySettingsBase>>;
  public userResourcesCollection: AngularFirestoreCollection<UserResources>;
  public commandsCollection: AngularFirestoreCollection<CommandBase>;
  public currentDocumentId = '';

  constructor(
    private afFirestore: AngularFirestore,
    private authService: AuthenticationService,
    private router: Router,
    private http: HttpClient
  ) {
    this.usersCollection = afFirestore.collection<UserData>('users');
    this.cvsCollection = afFirestore.collection<DocumentData>('documents');
    this.commandsCollection = afFirestore.collection<CommandBase>('commands');
    this.userResourcesCollection = afFirestore.collection<UserResources>('userResources');
    this.dataSourcesCollection = this.afFirestore.collection('dataSources');

    authService.authenticatedUser.subscribe((u) => {
      const authUser = <AuthenticatedUser>u;
      if (authUser) {
        const docRef = this.usersCollection.doc(authUser.uid).ref;
        docRef.get().then((doc) => {
          if (doc.exists) {
            console.log('Logged in as user:', authUser.displayName, doc, doc.data());
            const settings = (<UserData>doc.data()).settings;
            // if (!settings || settings.createdProfile !== true) {
            //   this.router.navigateByUrl('/new-user');
            // }

          } else {
            console.log('No user saved, let\'s create an account');
            const newUser = new UserData();
            newUser.name = authUser.displayName;
            newUser.id = authUser.uid;
            newUser.photo = authUser.photoURL;
            newUser.email = authUser.email;
            newUser.settings = {
              createdProfile: false
            };

            docRef.set(Utility.cloneObject(newUser)).then(() => {
              this.router.navigateByUrl('/new-user');
            });
          }
        }).catch(function (error) {
          console.log('Error getting document:', error);
        });
      }
    });
  }

  getCurrentUser(): Promise<UserData> {
    return new Promise((resolve, reject) => {
      console.log('this.authService.currentUserId', this.authService.currentUserId);
      if (this.authService.currentUserId !== '') {
        this.getUser(this.authService.currentUserId).then(
          (userData) => {
            console.log('user get complete');
            resolve(userData);
          },
          (e) => {
            console.log('user get failed');
            reject(e);
          }
        );
      } else {
        reject('No user logged in');
      }
    });
  }

  getCVlist(userId: string): Observable<DocumentData[]> {
    const observable = (this.afFirestore.collection('documents', ref => ref.where('owners', 'array-contains', userId)));
    return <Observable<DocumentData[]>>observable.valueChanges();
  }

  getUserObservable(id: string): Observable<UserData> {
    return <Observable<UserData>>this.usersCollection.doc(id).valueChanges();
  }

  getUser(id: string): Promise<UserData> {
    return new Promise<UserData>((resolve, reject) => {
      this.usersCollection.doc(id).valueChanges().pipe(first()).toPromise().then(
        <any>((userData: UserData) => {
          console.log('user get complete');
          console.log(userData);
          resolve(userData);
        }),
        (e: any) => {
          console.log('user get failed');
          reject(e);
        }
      );
    });
  }

  saveUser(id: string, userData: UserData) {
    return new Promise((resolve, reject) => {
      const saveData = JSON.parse(JSON.stringify(userData));
      this.authService.updateUserProfile(userData.name, userData.photo);
      this.usersCollection.doc(id).set(saveData, { merge: true }).then(
        () => {
          console.log('user saved complete');
          resolve();
        },
        () => {
          console.log('user saved failed');
          reject();
        }
      );
    });
  }

  createCV(cvData: DocumentData) {
    const newId = this.cvsCollection.ref.doc().id;
    cvData.id = newId;
    this.currentDocumentId = newId;
    return this.saveCV(newId, cvData);
  }

  getCV(id: string) {
    this.currentDocumentId = id;
    return this.cvsCollection.doc(id).valueChanges();
  }

  saveCV(id: string, cvData: DocumentData) { // TODO use generic interface for saving both user/cv
    return new Promise((resolve, reject) => {
      const saveData = JSON.parse(JSON.stringify(cvData));
      this.cvsCollection.doc(id).set(saveData, { merge: true }).then(
        () => {
          console.log('document saved');
          resolve();
        },
        () => {
          console.log('document save failed');
          reject();
        }
      );
    });
  }

  removeCV(id: string) {
    return new Promise((resolve, reject) => {
      this.cvsCollection.doc(id).delete().then(
        () => {
          console.log('document deleted');
          resolve();
        },
        () => {
          console.log('document deletion failed');
          reject();
        }
      );
    });
  }

  getUserResources() {
    return this.userResourcesCollection.doc(this.authService.currentUserId).valueChanges();
  }

  createDataSource(data: ItemBase) {
    const newId = this.dataSourcesCollection.ref.doc().id;
    data.id = newId;
    data.created = Date.now();
    return this.saveDataSource(newId, data);
  }

  getDataSourceObs(id: string) {
    return this.dataSourcesCollection.doc(id).valueChanges();
  }

  getDataSourcesByUserAndSource(uid: string, sourceId: string) {
    return new Promise((resolve, reject) => {
      const observable = (this.afFirestore.collection('dataSources', ref => {
        return ref.where('userId', '==', uid).where('sourceId', '==', sourceId);
      }));
      observable.valueChanges().pipe(first()).subscribe((list) => {
        resolve(list);
      });
    });
  }

  saveDataSource(id: string, data: any) {
    return new Promise((resolve, reject) => {
      const saveData = JSON.parse(JSON.stringify(data));
      console.log('saveDataSource', saveData);
      saveData.userId = this.authService.currentUserId;
      if (!saveData.owners || saveData.owners.length === 0) {
        saveData.owners = [this.authService.currentUserId];
      }

      this.dataSourcesCollection.doc(id).set(saveData, { merge: true }).then(
        () => {
          console.log('datasource saved');
          resolve();
        },
        (e) => {
          console.log('datasource save failed', e);
          reject();
        }
      );
    });
  }

  removeDataSource(id: string) {
    return new Promise((resolve, reject) => {
      this.dataSourcesCollection.doc(id).delete().then(
        () => {
          console.log('datasource deleted');
          resolve();
        },
        (e) => {
          console.log('datasource deletion failed', e);
          reject();
        }
      );
    });
  }

  validateInviteCode(token: string) {
    const body = {
      user: '',
      token: token
    };
    if (this.authService.currentUserId !== '') {
      body.user = this.authService.currentUserId;
    } else {
      throw ({ error: 'cannot add validate token if not logged in' });
    }
    const promise = this.http.post(
      environment.firebase.functionsRoot + 'validateinvite',
      JSON.stringify(body),
      {
        responseType: 'text'
      }
    ).toPromise();

    return promise;
  }

  createServerCommand(data: CommandBase, requireServerConfirmation = false) {
    return new Promise((resolve, reject) => {
      const newId = this.commandsCollection.ref.doc().id;
      data.id = newId;

      if (data.userId == null) {
        if (this.authService.currentUserId !== '') {
          data.userId = this.authService.currentUserId;
        } else {
          throw ({ error: 'cannot add server command if not logged in' });
        }
      }

      this.commandsCollection.doc(newId).set(data, { merge: true }).then(
        () => {
          console.log('command saved', data);
          if (requireServerConfirmation) {
            this.commandsCollection.doc(newId)
              .valueChanges()
              .pipe(first((v: CommandBase) => {
                return v && v.result && (v.result === 'success' || v.result === 'failure');
              }))
              .subscribe((v: CommandBase) => {
                if (v.result === 'success') {
                  console.log('command execution confirmed on server', data);
                  resolve();
                } else {
                  reject();
                }
              });
          } else {
            resolve();
          }
        },
        (e) => {
          console.log('command save failed', e);
          reject();
        }
      );
    });
  }
}

