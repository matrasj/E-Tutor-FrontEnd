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
import {ReactiveFormsModule} from "@angular/forms";
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


const routes = [
  {path : "login", component: LoginComponent},
  {path : "register", component: RegisterComponent},
  {path : "profile", component: ProfilePanelComponent, children : [
      {path : "messages", component : MessagesComponent},
      {path : "dashboard", component: DashboardComponent},
      {path : "advertisements", component: AdvertisementsComponent},
      {path : "create-advertisement-tutor", component: CreateAdvertisementComponent},
      {path : "create-advertisement-student", component: CreateAdvertisementComponent}
    ]},

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
    CreateAdvertisementComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatInputModule,
    RouterModule.forRoot(routes),
    MatButtonModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      closeButton: true
    }),
    HttpClientModule,
    MatMenuModule,
    MatSidenavModule,
    MatTabsModule,
    MatTableModule,
    MatSelectModule,
    NgxMatSelectSearchModule
  ],
  providers: [AuthService,
    { provide : HTTP_INTERCEPTORS, useClass : AuthInterceptor, multi : true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
