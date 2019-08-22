import { Injectable } from '@angular/core';
import { DeviceDetail } from '../models/device-detail.model';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class MultilinksCoreService {

   private currentDevice: DeviceDetail;

   deviceLoaded$ = new BehaviorSubject<boolean>(false);

   constructor(private http: HttpClient) {}

   /* This is getting current device info from the backend */
   deviceLoginInitialisation(): void {
      this.http.get<DeviceDetail>(environment.multilinksCoreInfo.loginEndpoint).subscribe(
         data => {
            this.currentDevice = data;
            this.deviceLoaded$.next(true);
         },
         (error: HttpErrorResponse) => {
            console.log(error.error.message);
         }
      );
   }

   getCurrentDevice(): DeviceDetail {
      return this.currentDevice;
   }
}
