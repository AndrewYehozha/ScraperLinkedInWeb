import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MaterialDesignModule } from '../app/material-design/material-design.module';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { LoginMenuComponent } from './authorization/login-menu/login-menu.component';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AlertMessageComponent } from './alert-message/alert-message.component';
import { CompaniesComponent } from './companies/companies.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { LoginComponent } from './authorization/login/login.component';
import { RegisterComponent } from './authorization/register/register.component';
import { LogoutComponent } from './authorization/logout/logout.component';

import { AuthorizeGuard } from './authorization/authorize.guard';
import { AuthorizeInterceptor } from './authorization/authorize.interceptor';

import { AuthorizeService } from './authorization/authorize.service';
import { CookieService } from 'ngx-cookie-service';
import { AlertMessageService } from './services/alert-message.service';

@NgModule({
  declarations: [
    AppComponent,
    AlertMessageComponent,
    NavMenuComponent,
    LoginMenuComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    ProfileComponent,
    ChangePasswordComponent,
    SettingsComponent,
    CompaniesComponent,
    FetchDataComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MaterialDesignModule,
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent, pathMatch: 'full' },
      { path: 'login', component: LoginComponent, canActivate: [AuthorizeGuard] },
      { path: 'register', component: RegisterComponent, canActivate: [AuthorizeGuard] },
      { path: 'logout', component: LogoutComponent },
      { path: 'profile', component: ProfileComponent, canActivate: [AuthorizeGuard] },
      { path: 'settings', component: SettingsComponent, canActivate: [AuthorizeGuard] },
      { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthorizeGuard] },
      { path: 'companies', component: CompaniesComponent, canActivate: [AuthorizeGuard] },
      { path: 'fetch-data', component: FetchDataComponent, canActivate: [AuthorizeGuard] },

      // otherwise redirect to home
      { path: '**', redirectTo: 'home' }
    ])
  ],
  providers: [
    AuthorizeGuard,
    AuthorizeService,
    CookieService,
    AlertMessageService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
