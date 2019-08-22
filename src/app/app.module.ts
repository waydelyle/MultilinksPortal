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

@NgModule({
   declarations: [
      AppComponent,
      SharedHeaderComponent,
      SharedFooterComponent,
      HomeComponent,
      GuestNavbarTopComponent
   ],
   imports: [
      BrowserModule,
      RouterModule.forRoot([
         { path: 'home', component: HomeComponent },
         { path: '**', redirectTo: 'home' }
      ])
   ],
   providers: [
      { provide: 'BASE_URL', useFactory: getBaseUrl },
      { provide: ErrorHandler, useClass: ErrorsHandler },
      AppEnvironment,
      ErrorsHandler,
      MultilinksIdentityService,
      MultilinksCoreService
   ],
   bootstrap: [AppComponent]
})

export class AppModule { }

export function getBaseUrl() {
   return document.getElementsByTagName('base')[0].href;
}
