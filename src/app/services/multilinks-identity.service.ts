import { Injectable } from "@angular/core";
import { UserManager, User } from 'oidc-client';
import { environment } from 'src/environments/environment';
import { ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
import { ErrorsHandler, ErrorCodes } from './errors-handler.service';

@Injectable ({
   providedIn: 'root'
})

export class MultilinksIdentityService {

   private userManager: UserManager = new UserManager(environment.multilinksIdentityInfo.oidcInfo);
   private currentUser: User;
   private loggedIn: string = 'userLocallyLoggedIn';

   userLoaded$ = new ReplaySubject();

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

   constructor(private router: Router, private errorsHandler: ErrorsHandler) {
      this.userManager.clearStaleState();

      this.userManager.events.addUserLoaded(user => {
         this.currentUser = user;
         localStorage.setItem(this.loggedIn, 'true');
         this.userLoaded$.next(true);
      });

      this.userManager.events.addUserUnloaded(() => {});
   }

   registerUser() {
      window.location.href = environment.multilinksIdentityInfo.registerEndpoint;
   }

   triggerSignIn() {
      this.clearUserLoggedInStates();
      
      this.userManager.signinRedirect()
      .then(function () {
         if (!environment.production) {
            console.log('Redirection to signin triggered');
         }
      })
      .catch(error => {
         let errorCode = this.errorsHandler.convertToErrorCode(error);

         if (errorCode == ErrorCodes.SERVER_CONNECT_TIMEOUT_ERROR) {
            
         }
         
         this.router.navigate(['420']);
      });
   }

   triggerSignOut() {
      this.clearUserLoggedInStates();

      this.userManager.signoutRedirect().then(function (response) {
         if (!environment.production) {
            console.log('Redirection to signout triggered');
         }
      });
   }

   handleCallBack() {
      this.userManager.signinRedirectCallback().then(function (user) {
         if (!environment.production) {
            console.log('Callback after sign in handle');
         }
      });
   }

   handleSilentCallback(){
      this.userManager.signinSilentCallback().then(function (user){
         if (user != null){
            this.currentUser = user;
         }
         if (!environment.production) {
            console.log('Callback after silent signin handled.');
         }
      })
   }

   clearUserLoggedInStates() {
      this.currentUser = null;
      localStorage.removeItem(this.loggedIn);
      this.userLoaded$.next(false);
   }
}