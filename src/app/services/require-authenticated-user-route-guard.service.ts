import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { MultilinksIdentityService } from './multilinks-identity.service';

@Injectable()
export class RequireAuthenticatedUserRouteGuardService implements CanActivate {

   constructor(private identityService: MultilinksIdentityService) {}

   canActivate() {
      if (this.identityService.userAvailable) {
         return true;
      }
      else {
         // trigger signin
         this.identityService.triggerSignIn();
         return false;
      }
   }
}
