import { Injectable } from "@angular/core";
import { UserManager, User } from 'oidc-client';
import { environment } from 'src/environments/environment';
import { ReplaySubject } from 'rxjs';
import { CaughtErrorsHandler } from './caught-errors-handler.service';

@Injectable ({
   providedIn: 'root'
})

export class MultilinksIdentityService {

   private userManager: UserManager = new UserManager(environment.multilinksIdentityInfo.oidcInfo);
   private currentUser: User;
   private loggedIn: string = 'userLocallyLoggedIn';

   userLoaded$ = new ReplaySubject();

   constructor(private errorsHandler: CaughtErrorsHandler) {
      this.userManager.clearStaleState();

      this.userManager.events.addUserLoaded(user => {
         this.currentUser = user;
         localStorage.setItem(this.loggedIn, 'true');
         this.userLoaded$.next(true);
      });

      this.userManager.events.addUserUnloaded(() => {});
   }

   get userAvailable(): boolean {
      return this.currentUser != null;
   }

   get user(): User {
      return this.currentUser;
   }

   get isLoggedIn(): boolean {
      let loggedIn: string = localStorage.getItem(this.loggedIn);
      return loggedIn != null;
   }

   registerUser() {
      window.location.href = environment.multilinksIdentityInfo.registerEndpoint;
   }

   triggerSignIn() {
      this.clearUserLoggedInStates();

      this.userManager.signinRedirect()
         .catch(error => {
            this.errorsHandler.handleCaughtException(error);
         });
   }

   triggerSignOut() {
      this.clearUserLoggedInStates();

      this.userManager.signoutRedirect()
         .catch(error => {
            this.errorsHandler.handleCaughtException(error);
         });
   }

   handleCallBack() {
      this.userManager.signinRedirectCallback()
         .catch(error => {
            this.errorsHandler.handleCaughtException(error);
         });
   }

   handleSilentCallback() {
      this.userManager.signinSilentCallback()
         .then(function (user) {
            if (user != null) {
               this.currentUser = user;
            }
         })
         .catch(error => {
            this.errorsHandler.handleCaughtException(error);
         });
   }

   clearUserLoggedInStates() {
      this.currentUser = null;
      localStorage.removeItem(this.loggedIn);
      this.userLoaded$.next(false);
   }
}