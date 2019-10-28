import { RouterModule, Routes } from '@angular/router';
import { EditProfileComponent } from './routes/edit-profile/edit-profile.component';
import { DocumentListComponent } from './routes/document-list/document-list.component';
import { StartComponent } from './routes/start/start.component';
import { EditDocumentComponent } from './routes/edit-document/edit-document.component';
import { CvdataComponent } from './routes/cvdata/cvdata.component';
import { EditDataSourceComponent } from './routes/edit-data-source/edit-data-source.component';
import { PrivacyPolicyComponent } from './routes/privacy-policy/privacy-policy.component';
import { AdminAreaComponent } from './routes/admin-area/admin-area.component';
import { LoginGuard } from './route-guards/login.guard';
import { NewUserGuard } from './route-guards/newuser.guard';
import { AutoLoginGuard } from './route-guards/auto-login.guard';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'start',
    pathMatch: 'full'
  },
  {
    path: 'start',
    component: StartComponent,
    data: { state: 'depth01' },
    canActivate: [AutoLoginGuard]
  },
  {
    path: 'list',
    component: DocumentListComponent,
    data: { state: 'depth02' },
    canActivate: [LoginGuard, NewUserGuard]
  },
  {
    path: 'document/:documentId',
    component: EditDocumentComponent,
    data: { state: 'depth03' }
  },
  {
    path: 'edit-document/:documentId',
    component: EditDocumentComponent,
    data: { state: 'depth03' },
    canActivate: [LoginGuard, NewUserGuard]
  },
  {
    path: 'edit-profile',
    component: EditProfileComponent,
    data: { state: 'depth03' },
    canActivate: [LoginGuard, NewUserGuard]
  },
  {
    path: 'new-user',
    component: EditProfileComponent,
    data: { state: 'depth01' },
    canActivate: [LoginGuard]
  },
  // {
  //   path: 'edit-profile/:pageNo',
  //   component: EditProfileComponent,
  //   data: { state: 'depth03' }
  // },
  {
    path: 'edit-data-source/:dataSourceId',
    component: EditDataSourceComponent,
    data: { state: 'depth03' },
    canActivate: [LoginGuard]
  },
  {
    path: 'privacypolicy',
    component: PrivacyPolicyComponent,
    pathMatch: 'full'
  },
  {
    path: 'admin',
    component: AdminAreaComponent,
    pathMatch: 'full',
    canActivate: [LoginGuard]
  },
  {
    path: 'cvdataauth',
    component: CvdataComponent,
    pathMatch: 'full'
  },
];


export const routing = RouterModule.forRoot(appRoutes, {
  // useHash: true
});
