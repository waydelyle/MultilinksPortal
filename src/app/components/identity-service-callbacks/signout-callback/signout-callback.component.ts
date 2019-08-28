import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
   selector: 'signout-callback',
   templateUrl: './signout-callback.component.html'
})

export class SignoutCallbackComponent {

   constructor(private router: Router) {}

   ngOnInit() {
      this.router.navigate(['./']);
   }
}
