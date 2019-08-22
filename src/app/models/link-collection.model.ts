import { LinkDetail } from './link-detail.model';

export class LinkCollection {

   offset!: number;
   limit!: number;
   size!: number;

   value!: LinkDetail[];
}