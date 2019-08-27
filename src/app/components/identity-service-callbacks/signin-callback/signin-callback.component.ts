import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MultilinksIdentityService } from 'src/app/services/multilinks-identity.service';
import { MultilinksCoreService } from 'src/app/services/multilinks-core.service';

@Component({
   selector: 'signin-callback',
   templateUrl: './signin-callback.component.html'
})

export class SigninCallbackComponent implements OnInit{

   constructor(private identityService: MultilinksIdentityService,
      private coreService: MultilinksCoreService,
      private router: Router) {
   }

   ngOnInit() {
      this.identityService.userLoaded$.subscribe((userLoaded) => {
         if (userLoaded) {
            this.coreService.deviceLoginInitialisation();
            this.router.navigate(['/']);
         }
      });

      this.identityService.handleCallBack();
   }
}
