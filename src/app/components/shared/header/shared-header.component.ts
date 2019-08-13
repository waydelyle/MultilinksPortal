import { Component } from '@angular/core';

@Component({
   selector: 'shared-header',
   templateUrl: './shared-header.component.html'
})

export class SharedHeaderComponent {

   backToHome() {
      console.log("We should redirect to the web console");
      // this.router.navigateByUrl(`${environment.web_console}`);
   }
}
