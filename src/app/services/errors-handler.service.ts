import { ErrorHandler, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

enum ErrorCodes {

   NONE = 200,
   NOT_FOUND_ERROR = 404,
   CLIENT_UNKNOWN_ERROR = 420,   /* Unofficial */
   NO_CONNECTION_ERROR = 490,    /* Custom */
   SERVER_UNKNOWN_ERROR = 520    /* Unofficial */
}

@Injectable()
export class ErrorsHandler implements ErrorHandler {

   handleError(error: Error | HttpErrorResponse) {
      let errorCode = this.convertToErrorCode(error);

      console.error('Error code: ', errorCode);
   }

   convertToErrorCode(error: Error | HttpErrorResponse): ErrorCodes {
      if (error instanceof HttpErrorResponse) {
         if (!navigator.onLine) {
            return ErrorCodes.NO_CONNECTION_ERROR;
         }
         return ErrorCodes.SERVER_UNKNOWN_ERROR;
      } else {
         if (error.message.includes('Cannot match any routes')) {
            return ErrorCodes.NOT_FOUND_ERROR;
         }
         return ErrorCodes.CLIENT_UNKNOWN_ERROR;
      }
   }
}