import { ErrorHandler, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

export enum ErrorCodes {
   NONE = 200,
   NOT_FOUND_ERROR = 404,
   CLIENT_UNKNOWN_ERROR = 420,         /* Unofficial */
   NO_CONNECTION_ERROR = 490,          /* Custom */
   SERVER_UNKNOWN_ERROR = 520,         /* Unofficial */
   SERVER_CONNECT_TIMEOUT_ERROR = 599  /* Unofficial */
}

@Injectable()
export class ErrorsHandler implements ErrorHandler {

   handleError(error: Error | HttpErrorResponse) {
      console.error(error);
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

         if (error.message.includes('Network Error')) {
            return ErrorCodes.SERVER_CONNECT_TIMEOUT_ERROR;
         }

         return ErrorCodes.CLIENT_UNKNOWN_ERROR;
      }
   }
}