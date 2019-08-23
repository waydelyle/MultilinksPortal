import { Component, OnInit } from '@angular/core';
import { MultilinksCoreService } from 'src/app/services/multilinks-core.service';

@Component({
   selector: 'connection-loader',
   templateUrl: './connection-loader.component.html'
})
export class ConnectionLoaderComponent implements OnInit {

   private reconnectionInProgress: boolean;
   private connectionActive: boolean;

   constructor(private coreService: MultilinksCoreService) { }

   ngOnInit() {
      this.coreService.reconnectionInProgress$.subscribe(inProgress => {
         this.reconnectionInProgress = inProgress;
      });

      this.coreService.connectionActive$.subscribe(isActive => {
         this.connectionActive = isActive;
      });
   }

   connect(): void {
      this.coreService.reconnectSignalRConnection();
   }
}
