import { Component, HostListener } from '@angular/core';
import { MultilinksIdentityService } from './services/multilinks-identity.service';
import { MultilinksCoreService } from './services/multilinks-core.service';
import { timer } from 'rxjs';

@Component({
   selector: 'app-root',
   templateUrl: './app.component.html'
})

export class AppComponent {

   loadingInProgress: boolean = true;
   connectionActive: boolean;

   constructor(private identityService: MultilinksIdentityService,
      private coreService: MultilinksCoreService) {}

   ngOnInit() {
      this.coreService.deviceLoaded$.subscribe((deviceLoaded) => {
         if (deviceLoaded) {
            this.coreService.getLinksPendings(0, 0);
            this.coreService.getLinks(0, 0);
            this.coreService.getVisibleNotifications(0, 0);
            this.initiateLinkConnectionServices();
         }
      });

      var path = window.location.pathname;

      if (path == '/signin-oidc' || path == '/signout-oidc') {
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

   private initiateLinkConnectionServices(): void {
      this.coreService.initiateSignalRConnection();

      this.coreService.connectionActive$.subscribe((connectionActive) => {
         if (connectionActive) {
            const holdoffTimer = timer(3000).subscribe(() => {
               this.connectionActive = true;
            });
         }
         else {
            this.connectionActive = false;
         }
      });
   }

   @HostListener('window:onunload')
   beforeUnloadHander() {
      /* Any resource clean up can be done here before we close the Web Console. */
      this.coreService.finaliseSignalRConnection();
   }
}
