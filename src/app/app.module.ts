import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { SharedHeaderComponent } from './components/shared/header/shared-header.component';
import { SharedFooterComponent } from './components/shared/footer/shared-footer.component';

@NgModule({
   declarations: [
      AppComponent,
      SharedHeaderComponent,
      SharedFooterComponent
   ],
   imports: [
      RouterModule.forRoot([]),
      BrowserModule
   ],
   providers: [],
   bootstrap: [AppComponent]
})
export class AppModule { }
