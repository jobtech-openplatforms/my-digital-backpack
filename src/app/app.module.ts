import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from './../environments/environment';
import { AppComponent } from './app.component';
import { DocumentListComponent } from './routes/document-list/document-list.component';
import { EditProfileComponent } from './routes/edit-profile/edit-profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routing } from './app.routing';
import { AgmCoreModule } from '@agm/core';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './components/header/header.component';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { FormsModule } from '@angular/forms';
import { MapSearchComponent } from './components/map-search/map-search.component';
import { StartComponent } from './routes/start/start.component';
import { AlertModalComponent } from './components/alert-modal/alert-modal.component';
import { EnterValueModalComponent } from './components/enter-value-modal/enter-value-modal.component';
import { EditDocumentComponent } from './routes/edit-document/edit-document.component';
import { EditableListComponent } from './components/editable-list/editable-list.component';
import { EducationDisplayComponent } from './routes/edit-document/education-display/education-display.component';
import { DynamicModule } from 'ng-dynamic-component';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { EmploymentDisplayComponent } from './routes/edit-document/employment-display/employment-display.component';
import { ProfileDisplayComponent } from './routes/edit-document/profile-display/profile-display.component';
import { GigDataDisplayComponent } from './routes/edit-document/gig-data-display/gig-data-display.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { DynamicDataEditorModalComponent } from './components/dynamic-data-editor-modal/dynamic-data-editor-modal.component';
import { SubmitButtonComponent } from './components/submit-button/submit-button.component';
import { GigDataEditorComponent } from './routes/edit-document/gig-data-editor/gig-data-editor.component';
import { StatusMessageFieldComponent } from './components/status-message-field/status-message-field.component';
import { SharingModelComponent } from './routes/document-list/sharing-modal/sharing-modal.component';
import { HttpClientModule } from '@angular/common/http';
import { CvdataComponent } from './routes/cvdata/cvdata.component';
import {
  GigDataSelectPlatformComponent
} from './routes/edit-document/gig-data-editor/gig-data-select-platform/gig-data-select-platform.component';
import { ValidateEmailModalComponent } from './components/validate-email-modal/validate-email-modal.component';
import { ImageUploadFormInputComponent } from './components/image-upload-form-input/image-upload-form-input.component';
import { ManualDataValidationModalComponent } from './components/manual-data-validation-modal/manual-data-validation-modal.component';
import { AuthenticationModalComponent } from './components/authentication-modal/authentication-modal.component';
import { EditDataSourceComponent } from './routes/edit-data-source/edit-data-source.component';
import { ReviewDataDisplayComponent } from './routes/edit-document/review-data-display/review-data-display.component';
import { ReviewDataEditorComponent } from './routes/edit-document/review-data-editor/review-data-editor.component';
import { AddCategoryComponent } from './routes/edit-document/add-category/add-category.component';
import { EditCategoriesComponent } from './routes/edit-document/edit-categories/edit-categories.component';
import { CertificateDataDisplayComponent } from './routes/edit-document/certificate-data-display/certificate-data-display.component';
import { CertificateDataEditorComponent } from './routes/edit-document/certificate-data-editor/certificate-data-editor.component';
import { MyCVDataInfoComponent } from './components/my-cvdata-info/my-cvdata-info.component';
import { PrivacyPolicyComponent } from './routes/privacy-policy/privacy-policy.component';
import { AdminAreaComponent } from './routes/admin-area/admin-area.component';
import { LoginComponent } from './routes/start/login/login.component';
import { EmailVerificationModalComponent } from './routes/start/email-verification-modal/email-verification-modal.component';
import { ValidationSymbolComponent } from './components/validation-symbol/validation-symbol.component';
import { FeedbackButtonComponent } from './components/feedback-button/feedback-button.component';
import { FeedbackModalComponent } from './components/feedback-modal/feedback-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    DocumentListComponent,
    EditProfileComponent,
    HeaderComponent,
    MapSearchComponent,
    StartComponent,
    AlertModalComponent,
    EnterValueModalComponent,
    EditDocumentComponent,
    EditableListComponent,
    EducationDisplayComponent,
    DynamicDataEditorModalComponent,
    DynamicFormComponent,
    EmploymentDisplayComponent,
    ProfileDisplayComponent,
    GigDataDisplayComponent,
    StarRatingComponent,
    SubmitButtonComponent,
    GigDataEditorComponent,
    StatusMessageFieldComponent,
    SharingModelComponent,
    GigDataSelectPlatformComponent,
    CvdataComponent,
    ValidateEmailModalComponent,
    ImageUploadFormInputComponent,
    ManualDataValidationModalComponent,
    AuthenticationModalComponent,
    EditDataSourceComponent,
    ReviewDataDisplayComponent,
    ReviewDataEditorComponent,
    AddCategoryComponent,
    EditCategoriesComponent,
    CertificateDataDisplayComponent,
    CertificateDataEditorComponent,
    MyCVDataInfoComponent,
    PrivacyPolicyComponent,
    AdminAreaComponent,
    LoginComponent,
    EmailVerificationModalComponent,
    ValidationSymbolComponent,
    FeedbackButtonComponent,
    FeedbackModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    routing,
    NgbModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDpWzuGB-wl7R_dgBRpRnGhE8NZZZuxdco',
      libraries: ['places']
    }),
    DynamicModule.withComponents([
      EducationDisplayComponent,
      EmploymentDisplayComponent,
      GigDataDisplayComponent,
      GigDataEditorComponent,
      ReviewDataDisplayComponent,
      ReviewDataEditorComponent,
      DynamicDataEditorModalComponent,
      ImageUploadFormInputComponent,
      CertificateDataDisplayComponent,
      CertificateDataEditorComponent
    ])
  ],
  providers: [],
  entryComponents: [
    AlertModalComponent,
    EnterValueModalComponent,
    SharingModelComponent,
    ValidateEmailModalComponent,
    ManualDataValidationModalComponent,
    AuthenticationModalComponent,
    AddCategoryComponent,
    EditCategoriesComponent,
    MyCVDataInfoComponent,
    EmailVerificationModalComponent,
    FeedbackModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
