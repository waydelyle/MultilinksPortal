import { Component } from '@angular/core';
import { MultilinksIdentityService } from 'src/app/services/multilinks-identity.service';

@Component({
   selector: 'registration-confirmed',
   templateUrl: './registration-confirmed.component.html'
})

export class RegistrationConfirmedComponent {

   constructor(private identityService: MultilinksIdentityService) {
   }

   ngOnInit() {
      this.identityService.triggerSignIn();
   }
}
