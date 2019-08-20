import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { SharedHeaderComponent } from './components/shared/header/shared-header.component';
import { SharedFooterComponent } from './components/shared/footer/shared-footer.component';
import { HomeComponent } from './components/home/home.component';
import { AppEnvironment } from './services/app-environment.service';
import { GuestNavbarTopComponent } from './components/shared/header/guest-navbar-top.component';

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
      AppEnvironment
   ],
   bootstrap: [AppComponent]
})
export class AppModule { }
