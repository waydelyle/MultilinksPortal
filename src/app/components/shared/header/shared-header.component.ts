import { Component } from '@angular/core';
import { AppEnvironment } from 'src/app/services/app-environment.service';

@Component({
   selector: 'shared-header',
   templateUrl: './shared-header.component.html'
})

export class SharedHeaderComponent {

   releaseInfo: string;
   
   constructor(private appEnv: AppEnvironment) {
      this.releaseInfo = this.appEnv.getReleaseInfo();
   }
}
