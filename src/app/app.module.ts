import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import {RouterModule} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import { FooterComponent } from './components/footer/footer.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ToastrModule} from "ngx-toastr";
import {AuthService} from "./service/auth-service";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterceptor} from "./config/auth-interceptor";
import {MatMenuModule} from "@angular/material/menu";
import { HomePageComponent } from './components/home-page/home-page.component';
import { ProfilePanelComponent } from './components/profile-panel/profile-panel.component';
import { NavigationComponent } from './components/profile-panel/navigation/navigation.component';
import { MessagesComponent } from './components/profile-panel/activities/messages/messages.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import { DashboardComponent } from './components/profile-panel/activities/dashboard/dashboard.component';
import {AdvertisementsComponent} from "./components/profile-panel/activities/advertisements/advertisements.component";
import {MatTabsModule} from "@angular/material/tabs";
import {MatTableModule} from "@angular/material/table";
import { CreateAdvertisementComponent } from './components/profile-panel/activities/create-advertisement/create-advertisement.component';
import {NgxMatSelectSearchModule} from "ngx-mat-select-search";
import {EditorModule} from "@tinymce/tinymce-angular";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {AdvertisementService} from "./service/advertisement-service";
import {NgCircleProgressModule} from "ng-circle-progress";
import { CompleteProfileComponent } from './components/profile-panel/activities/complete-profile/complete-profile.component';
import {UserService} from "./service/user-service";
import {CityService} from "./service/city-service";
import { AdvertisementsListComponent } from './components/advertisements/advertisements-list/advertisements-list.component';
import { SingleAdvertisementViewComponent } from './components/advertisements/single-advertisement-view/single-advertisement-view.component';
import {ReviewService} from "./service/review-service";
import { ReviewFormComponent } from './components/advertisements/review-form/review-form.component';
import {MatDialogModule} from "@angular/material/dialog";
import { AdvertisementRowComponent } from './components/advertisements/advertisement-row/advertisement-row.component';
import {MessageService} from "./service/message-service";
import { MessageFormComponent } from './components/advertisements/message-form/message-form.component';
import { MessagesListComponent } from './components/profile-panel/activities/messages/messages-list/messages-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConversationChatComponent } from './components/profile-panel/activities/messages/conversation-chat/conversation-chat.component';
import {AuthGuard} from "./config/auth-guard";
import { SubjectOrCitiesListComponent } from './components/home-page/subject-or-cities-list/subject-or-cities-list.component';
import {StateService} from "./service/state-service";

const routes = [
  {path : "login", component: LoginComponent},
  {path : "register", component: RegisterComponent},
  {path : "subjects", component: SubjectOrCitiesListComponent},
  {path : "cities", component: SubjectOrCitiesListComponent},
  {path : "profile", component: ProfilePanelComponent, children : [
      {path : "", component: DashboardComponent},
      {path : "messages", component : MessagesComponent},
      {path : "messages/chat/user/:id", component : ConversationChatComponent},
      {path : "complete", component : CompleteProfileComponent},
      {path : "advertisements", component: AdvertisementsComponent},
      {path : "create-advertisement-tutor", component: CreateAdvertisementComponent},
      {path : "create-advertisement-student", component: CreateAdvertisementComponent}
    ], canActivate : [AuthGuard]},
  {path : "advertisements", component: AdvertisementsListComponent},
  {path : "advertisements/:id", component: SingleAdvertisementViewComponent},
  {path : "", component: HomePageComponent}
]
@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    LoginComponent,
    RegisterComponent,
    FooterComponent,
    HomePageComponent,
    ProfilePanelComponent,
    NavigationComponent,
    MessagesComponent,
    DashboardComponent,
    AdvertisementsComponent,
    CreateAdvertisementComponent,
    CompleteProfileComponent,
    AdvertisementsListComponent,
    SingleAdvertisementViewComponent,
    ReviewFormComponent,
    AdvertisementRowComponent,
    MessageFormComponent,
    MessagesListComponent,
    ConversationChatComponent,
    SubjectOrCitiesListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatInputModule,
    RouterModule.forRoot(routes),
    MatButtonModule,
    ReactiveFormsModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300

    }),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      closeButton: true
    }),
    HttpClientModule,
    MatMenuModule,
    MatDialogModule,
    MatSidenavModule,
    MatTabsModule,
    MatTableModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    EditorModule,
    MatCheckboxModule,
    FormsModule,
    NgbModule
  ],
  providers: [AuthService,
    { provide : HTTP_INTERCEPTORS, useClass : AuthInterceptor, multi : true},
  AdvertisementService,
  CityService,
  ReviewService,
  MessageService,
  UserService,
  StateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
