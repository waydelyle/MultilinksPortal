import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class AppEnvironment {

   constructor() {}

   getReleaseInfo(): string {
      return `${environment.releaseInfo.type} ${environment.releaseInfo.version}`;
   }
}
