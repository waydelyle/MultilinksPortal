import { Component } from '@angular/core';
import { MultilinksIdentityService } from './services/multilinks-identity.service';

@Component({
   selector: 'app-root',
   templateUrl: './app.component.html'
})

export class AppComponent {

   loadingInProgress: boolean = true;
   connectionActive: boolean;

   constructor(private identityService: MultilinksIdentityService) {}

   ngOnInit() {
      var path = window.location.pathname;

      if (path == '/identity-signin-callback' || path == '/identity-signout-callback') {
         this.loadingInProgress = false;
         return;
      }

      if (this.identityService.isLoggedIn && !this.identityService.userAvailable) {
         this.identityService.triggerSignIn();
      }
      else {
         this.loadingInProgress = false;
      }
   }
}
