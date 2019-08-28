import { Component } from '@angular/core';
import { MultilinksIdentityService } from 'src/app/services/multilinks-identity.service';

@Component({
   selector: 'user-navbar-top',
   templateUrl: './user-navbar-top.component.html'
})

export class UserNavbarTopComponent {
   
   constructor(private identityService: MultilinksIdentityService) {
   }

   signout() {
      this.identityService.triggerSignOut();
   }
}
