import { Component } from '@angular/core';
import { MultilinksIdentityService } from 'src/app/services/multilinks-identity.service';

@Component({
   selector: 'silent-renew-callback',
   templateUrl: './silent-renew-callback.component.html'
})
export class SilentRenewCallbackComponent {

   constructor(private identityService: MultilinksIdentityService) {}

   ngOnInit() {
      this.identityService.handleSilentCallback();
   }
}
