export enum NotificationType {
   None,
   LinkRequestAccepted,
   LinkRequestDenied
}

export class NotificationDetail {

   id!: string;    /* String representation of GUID. */
   notificationType!: NotificationType;
   message!: string;
   hidden!: boolean;
}