import { Component, OnInit } from '@angular/core';

@Component({
   selector: 'shared-footer',
   templateUrl: './shared-footer.component.html'
})

export class SharedFooterComponent implements OnInit {

   currentYear: number;

   ngOnInit(): void {
      this.currentYear = (new Date()).getFullYear();
   }
}
