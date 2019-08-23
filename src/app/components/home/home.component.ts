import { Component } from '@angular/core';
import { MultilinksIdentityService } from 'src/app/services/multilinks-identity.service';

@Component({
   selector: 'home',
   templateUrl: './home.component.html'
})

export class HomeComponent {

   constructor(private identityService: MultilinksIdentityService) {}
   
   ngOnInit() {
      particlesJS.load('particles', '../../../assets/js/particles.json', () => {})
   }

   register() {
      this.identityService.registerUser();
   }

   signin() {
      this.identityService.triggerSignIn();
   }
}
