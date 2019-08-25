import { ErrorHandler, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ErrorsHandler implements ErrorHandler {

   handleError(error: Error | HttpErrorResponse) {
      console.error("Unhandled error");
      console.error(error);
   }
}
