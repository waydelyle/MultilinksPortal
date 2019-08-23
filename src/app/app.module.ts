import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { SharedHeaderComponent } from './components/shared/header/shared-header.component';
import { SharedFooterComponent } from './components/shared/footer/shared-footer.component';
import { HomeComponent } from './components/home/home.component';
import { AppEnvironment } from './services/app-environment.service';
import { GuestNavbarTopComponent } from './components/shared/header/guest-navbar-top.component';
import { ErrorsHandler } from './services/errors-handler.service';
import { MultilinksIdentityService } from './services/multilinks-identity.service';
import { MultilinksCoreService } from './services/multilinks-core.service';
import { ExponentialBackoffRetryService } from './services/exponential-backoff-retry.service';
import { RequireAuthenticatedUserRouteGuardService } from './services/require-authenticated-user-route-guard.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AddAuthorizationHeaderInterceptor } from './intercepters/add-authorization-header-interceptor';
import { ConnectionLoaderComponent } from './components/shared/connection-loader/connection-loader.component';
import { RegistrationConfirmedComponent } from './components/identity-service-callbacks/registration-confirmed/registration-confirmed.component';

@NgModule({
   declarations: [
      AppComponent,
      SharedHeaderComponent,
      SharedFooterComponent,
      HomeComponent,
      GuestNavbarTopComponent,
      ConnectionLoaderComponent,
      RegistrationConfirmedComponent
   ],
   imports: [
      BrowserModule,
      CommonModule,
      HttpClientModule,
      RouterModule.forRoot([
         { path: '', redirectTo: 'home', pathMatch: 'full' },
         { path: 'home', component: HomeComponent },
         { path: 'identity-registration-confirmed', component: RegistrationConfirmedComponent },
         { path: '**', redirectTo: '404' }
      ])
   ],
   providers: [
      { provide: 'BASE_URL', useFactory: getBaseUrl },
      { provide: ErrorHandler, useClass: ErrorsHandler },
      { provide: HTTP_INTERCEPTORS, useClass: AddAuthorizationHeaderInterceptor, multi: true },
      AppEnvironment,
      ErrorsHandler,
      MultilinksIdentityService,
      MultilinksCoreService,
      ExponentialBackoffRetryService,
      RequireAuthenticatedUserRouteGuardService
   ],
   bootstrap: [AppComponent]
})

export class AppModule { }

export function getBaseUrl() {
   return document.getElementsByTagName('base')[0].href;
}
