import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommonModule} from '@angular/common';
import {
  MatBadgeModule,
  MatButtonModule,
  MatCardModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSnackBarModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './Posts Feed/home/home.component';
import {RegisterComponent} from './register/register.component';
import {MatFileUploadModule} from 'angular-material-fileupload';
import {AddPostComponent} from './Posts Feed/add-post/add-post.component';
import {AuthService} from './shared/services/auth.service';
import {ProfileComponent} from './Posts Feed/profile/profile.component';
import {NotAllowedComponent} from './Posts Feed/not-allowed/not-allowed.component';
import {User404Component} from './Posts Feed/user404/user404.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {EventsComponent} from './events/events.component';
import {FormatTimePipe} from './format-time.pipe';
import {QuizComponent} from './quiz/quiz.component';
import {ResourcesComponent} from './resources/resources.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    AddPostComponent,
    ProfileComponent,
    NotAllowedComponent,
    User404Component,
    DashboardComponent,
    EventsComponent,
    FormatTimePipe,
    QuizComponent,
    ResourcesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFileUploadModule,
    FormsModule,
    BrowserAnimationsModule,
    CommonModule,
    MatGridListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    AngularFireModule.initializeApp(environment.firebase),
    MatProgressBarModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    MatCardModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatListModule,
    AngularFireStorageModule,
    FormsModule,
    MatToolbarModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatDialogModule,
    MatTooltipModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatButtonModule,
    MatRadioModule,
    MatProgressSpinnerModule
  ],
  providers: [
    AuthService
  ],
  entryComponents: [
    AddPostComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
