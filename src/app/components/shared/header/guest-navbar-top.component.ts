import { Component } from '@angular/core';
import { MultilinksIdentityService } from 'src/app/services/multilinks-identity.service';

@Component({
   selector: 'guest-navbar-top',
   templateUrl: './guest-navbar-top.component.html'
})

export class GuestNavbarTopComponent {
   
   constructor(private identityService: MultilinksIdentityService) {
   }

   register() {
      this.identityService.registerUser();
   }

   signin() {
      this.identityService.triggerSignIn();
   }
}
