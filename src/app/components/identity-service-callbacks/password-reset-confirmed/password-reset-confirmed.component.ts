import { Component } from '@angular/core';
import { MultilinksIdentityService } from 'src/app/services/multilinks-identity.service';

@Component({
   selector: 'password-reset-confirmed',
   templateUrl: './password-reset-confirmed.component.html'
})

export class PasswordResetConfirmedComponent {

   constructor(private identityService: MultilinksIdentityService) {
   }

   ngOnInit() {
      this.identityService.triggerSignIn();
   }
}
