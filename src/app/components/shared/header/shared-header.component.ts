import { Component } from '@angular/core';
import { AppEnvironment } from 'src/app/services/app-environment.service';
import { MultilinksIdentityService } from 'src/app/services/multilinks-identity.service';
import { MultilinksCoreService } from 'src/app/services/multilinks-core.service';
import { timer } from 'rxjs';

@Component({
   selector: 'shared-header',
   templateUrl: './shared-header.component.html'
})

export class SharedHeaderComponent {

   releaseInfo: string;
   connectionActive: boolean;
   
   constructor(private appEnv: AppEnvironment,
      public identityService: MultilinksIdentityService,
      private coreService: MultilinksCoreService) {
      this.releaseInfo = this.appEnv.getReleaseInfo();
   }

   ngOninit() {
      this.coreService.connectionActive$.subscribe((connectionActive) => {
         if (connectionActive) {
            const holdoffTimer = timer(3000).subscribe(() => {
               this.connectionActive = true;
            });
         }
      });
   }
}
