import { LinkPendingDetail } from './link-pending-detail.model';

export class LinkPendingCollection {

   offset!: number;
   limit!: number;
   size!: number;

   value!: LinkPendingDetail[];
}