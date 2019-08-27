import { Injectable } from '@angular/core';
import { DeviceDetail } from '../models/device-detail.model';
import { BehaviorSubject, timer } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LinkPendingCollection } from '../models/link-pending-collection.model';
import { LinkCollection } from '../models/link-collection.model';
import { LinkPendingDetail } from '../models/link-pending-detail.model';
import { LinkDetail } from '../models/link-detail.model';
import { LinkRequestInfo } from '../models/link-request-info.model';
import { compare } from 'fast-json-patch';
import { NotificationCollection } from '../models/notification-collection.model';
import { NotificationDetail } from '../models/notification-detail.model';
import { ExponentialBackoffRetry } from '../models/exponential-backoff-retry.model';
import { HubConnection, HubConnectionBuilder, LogLevel, HubConnectionState } from '@aspnet/signalr';
import { ExponentialBackoffRetryService } from './exponential-backoff-retry.service';
import { MultilinksIdentityService } from './multilinks-identity.service';
import { CaughtErrorsHandler } from './caught-errors-handler.service';

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

   /* Notifications related data*/
   private newNotificationsCollection: NotificationCollection;
   numberOfNewNotifications$ = new BehaviorSubject<number>(0);
   newNotifications$ = new BehaviorSubject<NotificationDetail[]>([]);

   /* SignalR related data*/
   private hubConnection: HubConnection;
   private hubConnectionRetryData: ExponentialBackoffRetry;
   connectionActive$ = new BehaviorSubject<boolean>(false);
   reconnectionInProgress$ = new BehaviorSubject<boolean>(true);

   constructor(private http: HttpClient,
      private retryService: ExponentialBackoffRetryService,
      private identityService: MultilinksIdentityService,
      private errorsHandler: CaughtErrorsHandler) {
      this.linkPendingCollection = new LinkPendingCollection();
      this.linkPendingCollection.value = new Array<LinkPendingDetail>();
      this.linksCollection = new LinkCollection();
      this.linksCollection.value = new Array<LinkDetail>();
      this.newNotificationsCollection = new NotificationCollection();
      this.newNotificationsCollection.value = new Array<NotificationDetail>();
      this.hubConnectionRetryData = new ExponentialBackoffRetry();
      this.hubConnectionRetryData.initialInterval = environment.multilinksCoreInfo.signalRInfo.retrySetting.initialInterval;
      this.hubConnectionRetryData.maxInterval = environment.multilinksCoreInfo.signalRInfo.retrySetting.maxInterval;
      this.hubConnectionRetryData.maxRetries = environment.multilinksCoreInfo.signalRInfo.retrySetting.maxRetries;
      this.hubConnectionRetryData.additionalMaxRandomHoldoff = environment.multilinksCoreInfo.signalRInfo.retrySetting.additionalMaxRandomHoldoff;
   }

   /* This is getting current device info from the backend */
   deviceLoginInitialisation(): void {
      this.reconnectionInProgress$.next(true);

      this.http.get<DeviceDetail>(`${environment.multilinksCoreInfo.loginEndpoint}/${environment.multilinksIdentityInfo.device_name}`).subscribe(
         data => {
            this.currentDevice = data;
            this.deviceLoaded$.next(true);
         },
         (error) => {
            /* TODO: Add retry */
            this.reconnectionInProgress$.next(false);
         }
      );
   }

   getCurrentDevice(): DeviceDetail {
      return this.currentDevice;
   }

   sendNewLinkRequest(requestInfo: LinkRequestInfo) {
      return this.http.post(`${environment.multilinksCoreInfo.linksEndpoint}`, requestInfo);
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

   getVisibleNotifications(limit: number, offset: number): void {
      var url = `${environment.multilinksCoreInfo.notificationsEndpoint}`;

      url = url.concat(`/new/${this.currentDevice.endpointId}?`);

      if (limit != 0) {
         url = url.concat(`&limit=${limit}`);
      }

      if (offset != 0) {
         url = url.concat(`&offset=${offset}`);
      }

      this.http.get<NotificationCollection>(url).subscribe(data => {
            this.newNotificationsCollection = data;
            this.numberOfNewNotifications$.next(this.newNotificationsCollection.size);
            this.newNotifications$.next(this.newNotificationsCollection.value);
         },
         (error: HttpErrorResponse) => {
            if(error.status == 405) {
               console.error("HTTP method not allowed");
            }
            else {
               console.error(error.error.message);
            }
         }
      );
   }

   sendNotificationCleared(notification: NotificationDetail) {
      var url = `${environment.multilinksCoreInfo.notificationsEndpoint}/id/${notification.id}`;

      /* We can send a diff instead of the whole object. */
      var alteredNotification = Object.assign({}, notification);

      alteredNotification.hidden = true;
      let patchDocument = compare(notification, alteredNotification);

      this.http.patch(url, patchDocument, { headers: { 'Content-Type': 'application/json-patch+json' } }).subscribe(
         () => {
            this.getVisibleNotifications(this.newNotificationsCollection.limit, this.newNotificationsCollection.offset);
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

   notificationReceivedUpdate(notification: NotificationDetail) {
      var size = this.newNotificationsCollection.value.push(notification);
      this.numberOfNewNotifications$.next(size);
      this.newNotifications$.next(this.newNotificationsCollection.value);
   }

   initiateSignalRConnection(): void {
      /* Configure connection. */
      this.hubConnection = new HubConnectionBuilder()
         .withUrl(`${environment.multilinksCoreInfo.signalRInfo.hubEndpoint}?token=${this.identityService.user.access_token}&ep=${this.currentDevice.endpointId}`)
         .configureLogging(LogLevel.Error)
         .build();

      this.hubConnection.on("LinkRequestReceived", (linkId, sourceDeviceName, sourceDeviceOwnerName) => {
         var linkRequest = new LinkPendingDetail();

         linkRequest.linkId = linkId;
         linkRequest.sourceDeviceName = sourceDeviceName;
         linkRequest.sourceDeviceOwnerName = sourceDeviceOwnerName;
         this.linkRequestReceivedUpdate(linkRequest);
      });

      this.hubConnection.on("LinkConfirmationReceived", (linkId, associatedDeviceName, associatedDeviceOwnerName, isActive) => {
         var linkDetail = new LinkDetail();

         linkDetail.linkId = linkId;
         linkDetail.associatedDeviceName = associatedDeviceName;
         linkDetail.associatedDeviceOwnerName = associatedDeviceOwnerName;
         linkDetail.isActive = isActive;
         this.linkConfirmationReceivedUpdate(linkDetail);
      });

      this.hubConnection.on("NotificationReceived", (id, notificationType, message, hidden) => {
         var notificationDetail = new NotificationDetail();

         notificationDetail.id = id;
         notificationDetail.notificationType = notificationType;
         notificationDetail.message = message;
         notificationDetail.hidden = hidden;

         this.notificationReceivedUpdate(notificationDetail);
      });

      this.hubConnection.on("LinkActiveStateReceived", (linkId, isActive) => {
         this.linkActiveStateReceivedUpdate(linkId, isActive);
      });

      this.hubConnection.keepAliveIntervalInMilliseconds = 10000;
      this.hubConnection.serverTimeoutInMilliseconds = 20000;

      this.hubConnection.onclose(error => {
         this.reconnectionInProgress$.next(true);
         this.connectionActive$.next(false);
         this.handleSignalRConnectionFailure(error);
      });

      /* Call the start method after the on method. Doing so ensures your handlers are registered
         before any messages are received. */
      this.reconnectionInProgress$.next(true);
      this.startSignalRConnection();
   }

   startSignalRConnection(): void {
      if (this.hubConnection && this.hubConnection.state == HubConnectionState.Connected) {
         return;
      }

      this.hubConnection.start()
         .then(() => {
            if (!environment.production) {
               console.log("Connection started");
            }

            this.reconnectionInProgress$.next(false);
            this.connectionActive$.next(true);
            this.hubConnectionRetryData = this.retryService.resetExponentialBackoffRetryData(this.hubConnectionRetryData);
         })
         .catch(error => {
            this.handleSignalRConnectionFailure(error);
         });
   }

   reconnectSignalRConnection(): void {
      this.reconnectionInProgress$.next(true);
      this.startSignalRConnection();
   }

   finaliseSignalRConnection(): void {
      if (!this.hubConnection || this.hubConnection.state == HubConnectionState.Disconnected)
      {
         return;
      }

      this.hubConnection.stop()
         .then(() => {
            if (!environment.production) {
               console.log("Connection stopped");
            }

            this.reconnectionInProgress$.next(false);
            this.connectionActive$.next(false);
         })
         .catch(err => {
            if (!environment.production) {
               console.error("Device failed to disconnect");
            }
         });
   }

   handleSignalRConnectionFailure(error : Error): void {
      this.hubConnectionRetryData = this.retryService.updateExponentialBackoffRetryData(this.hubConnectionRetryData);

      if (this.hubConnectionRetryData.retryCompleted) {
         if (!environment.production) {
            console.log("Connection retry completed");
         }

         this.reconnectionInProgress$.next(false);
         return;
      }

      const holdoffTimer = timer(this.hubConnectionRetryData.totalHoldoffInterval).subscribe(() => {
         this.startSignalRConnection();
      });
   }
}
