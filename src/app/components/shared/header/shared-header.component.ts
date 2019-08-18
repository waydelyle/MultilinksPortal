import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
   selector: 'shared-header',
   templateUrl: './shared-header.component.html'
})

export class SharedHeaderComponent {

   releaseInfo: string;
   
   constructor() {
      this.releaseInfo = `${environment.releaseInfo.type} ${environment.releaseInfo.version}`
   }
}
