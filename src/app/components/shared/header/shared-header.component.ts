import { Component } from '@angular/core';
import { AppEnvironment } from 'src/app/services/app-environment.service';
import { MultilinksIdentityService } from 'src/app/services/multilinks-identity.service';

@Component({
   selector: 'shared-header',
   templateUrl: './shared-header.component.html'
})

export class SharedHeaderComponent {

   releaseInfo: string;
   
   constructor(private appEnv: AppEnvironment,
      private identityService: MultilinksIdentityService) {
      this.releaseInfo = this.appEnv.getReleaseInfo();
   }
}
