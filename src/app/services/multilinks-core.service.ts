import { Injectable } from '@angular/core';
import { DeviceDetail } from '../models/device-detail.model';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LinkPendingCollection } from '../models/link-pending-collection.model';
import { LinkCollection } from '../models/link-collection.model';
import { LinkPendingDetail } from '../models/link-pending-detail.model';
import { LinkDetail } from '../models/link-detail.model';
import { LinkRequestInfo } from '../models/link-request-info.model';
import { compare } from 'fast-json-patch';

@Injectable()
export class MultilinksCoreService {

   /* Devices (endpoints) related data*/
   private currentDevice: DeviceDetail;
   deviceLoaded$ = new BehaviorSubject<boolean>(false);

   /* Links related data*/
   private linkPendingCollection: LinkPendingCollection;
   private linksCollection: LinkCollection;

   numberOfLinkRequestPending$ = new BehaviorSubject<number>(0);
   linkRequestsPending$ = new BehaviorSubject<LinkPendingDetail[]>([]);
   numberOfLink$ = new BehaviorSubject<number>(0);
   links$ = new BehaviorSubject<LinkDetail[]>([]);

   constructor(private http: HttpClient) {
      this.linkPendingCollection = new LinkPendingCollection();
      this.linkPendingCollection.value = new Array<LinkPendingDetail>();
      this.linksCollection = new LinkCollection();
      this.linksCollection.value = new Array<LinkDetail>();
   }

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

   sendNewLinkRequest(requestInfo: LinkRequestInfo) {
      return this.http.post(`${environment.multilinksCoreInfo.loginEndpoint}`, requestInfo);
   }

   getLinksPendings(limit: number, offset: number): void {
      var url = `${environment.multilinksCoreInfo.linksEndpoint}`;

      url = url.concat(`/pending/${this.currentDevice.endpointId}?`);

      if (limit != 0) {
         url = url.concat(`&limit=${limit}`);
      }

      if (offset != 0) {
         url = url.concat(`&offset=${offset}`);
      }

      this.http.get<LinkPendingCollection>(url).subscribe(data => {
            this.linkPendingCollection = data;
            this.numberOfLinkRequestPending$.next(this.linkPendingCollection.size);
            this.linkRequestsPending$.next(this.linkPendingCollection.value);
         },
         (error: HttpErrorResponse) => {
            if(error.status == 405) {
               console.log("HTTP method not allowed");
            }
            else {
               console.log(error.error.message);
            }
         }
      );
   }

   getLinks(limit: number, offset: number): void {
      var url = `${environment.multilinksCoreInfo.linksEndpoint}`;

      url = url.concat(`/confirmed/source-id/${this.currentDevice.endpointId}`);

      if (limit != 0) {
         url = url.concat(`&limit=${limit}`);
      }

      if (offset != 0) {
         url = url.concat(`&offset=${offset}`);
      }

      this.http.get<LinkCollection>(url).subscribe(data => {
            this.linksCollection = data;
            this.numberOfLink$.next(this.linksCollection.size);
            this.links$.next(this.linksCollection.value);
         },
         (error: HttpErrorResponse) => {
            if(error.status == 405) {
               console.log("HTTP method not allowed");
            }
            else {
               console.log(error.error.message);
            }
         }
      );
   }

   sendLinkRequestAccepted(linkRequest: LinkPendingDetail) {
      var url = `${environment.multilinksCoreInfo.linksEndpoint}/confirmation/${linkRequest.linkId}`;

      /* We can send a diff instead of the whole object. */
      var alteredLinkRequest = Object.assign({}, linkRequest);

      alteredLinkRequest.confirmed = true;
      let patchDocument = compare(linkRequest, alteredLinkRequest);

      this.http.patch(url, patchDocument, { headers: { 'Content-Type': 'application/json-patch+json' } }).subscribe(
         () => {
            if (!environment.production) {
               console.log('Link request accepted updated');
            }

            this.getLinksPendings(this.linkPendingCollection.limit, this.linkPendingCollection.offset);
         },
         (error: HttpErrorResponse) => {
            if (error.status == 405) {
               console.error("HTTP method not allowed");
            }
            else {
               console.error(error.error.message);
            }
         }
      );
   }

   sendLinkRequestDeclined(linkRequest: LinkPendingDetail) {
      var url = `${environment.multilinksCoreInfo.linksEndpoint}/confirmation/${linkRequest.linkId}`;

      this.http.delete(url).subscribe(
         () => {
            if (!environment.production) {
               console.log('Link request status updated');
            }

            this.getLinksPendings(this.linkPendingCollection.limit, this.linkPendingCollection.offset);
         },
         (error: HttpErrorResponse) => {
            if (error.status == 405) {
               console.error("HTTP method not allowed");
            }
            else {
               console.error(error.error.message);
            }
         }
      );
   }

   linkRequestReceivedUpdate(linkRequest: LinkPendingDetail) {
      var size = this.linkPendingCollection.value.push(linkRequest);
      this.numberOfLinkRequestPending$.next(size);
   }

   linkConfirmationReceivedUpdate(linkDetail: LinkDetail) {
      var size = this.linksCollection.value.push(linkDetail);
      this.numberOfLink$.next(size);
      this.links$.next(this.linksCollection.value);
   }

   linkActiveStateReceivedUpdate(linkId: string, isActive: boolean) {
      let linkResult = this.linksCollection.value.find(link => link.linkId === linkId);
      
      if (linkResult) {
         linkResult.isActive = isActive;
      }
   }
}
