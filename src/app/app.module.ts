import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { SharedHeaderComponent } from './components/shared/header/shared-header.component';
import { SharedFooterComponent } from './components/shared/footer/shared-footer.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
   declarations: [
      AppComponent,
      SharedHeaderComponent,
      SharedFooterComponent,
      HomeComponent,
   ],
   imports: [
      BrowserModule,
      RouterModule.forRoot([
         { path: 'home', component: HomeComponent },
         { path: '**', redirectTo: 'home' }
      ])
   ],
   providers: [],
   bootstrap: [AppComponent]
})
export class AppModule { }
