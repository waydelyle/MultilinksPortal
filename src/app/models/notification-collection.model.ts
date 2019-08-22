import { NotificationDetail } from "./notification-detail.model";

export class NotificationCollection {

   offset!: number;
   limit!: number;
   size!: number;

   value!: NotificationDetail[];
}