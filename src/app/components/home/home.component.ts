import { Component } from '@angular/core';
import { MultilinksIdentityService } from 'src/app/services/multilinks-identity.service';
import { Router } from '@angular/router';

@Component({
   selector: 'home',
   templateUrl: './home.component.html'
})

export class HomeComponent {

   constructor(private identityService: MultilinksIdentityService,
      private router: Router) {}
   
   ngOnInit() {
      if (this.identityService.isLoggedIn) {
         this.router.navigate(['dashboard']);
      }
      else {
         particlesJS.load('particles', '../../../assets/js/particles.json', () => {})
      }
   }

   register() {
      this.identityService.registerUser();
   }

   signin() {
      this.identityService.triggerSignIn();
   }
}
