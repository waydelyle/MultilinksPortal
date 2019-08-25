import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

export enum ErrorCodes {
   NOT_FOUND_ERROR = 404,
   CLIENT_UNKNOWN_ERROR = 420,         /* Unofficial */
   NO_CONNECTION_ERROR = 490,          /* Custom */
   SERVER_UNKNOWN_ERROR = 520,         /* Unofficial */
   SERVER_CONNECT_TIMEOUT_ERROR = 599  /* Unofficial */
}

@Injectable()
export class CaughtErrorsHandler {

   constructor(private router: Router) {}

   handleCaughtException(error: Error | HttpErrorResponse) {
      let errorCode = this.convertToErrorCode(error);

      switch (errorCode)
      {
         case ErrorCodes.NOT_FOUND_ERROR:
            this.router.navigate(['error-404']);
            break;
         case ErrorCodes.CLIENT_UNKNOWN_ERROR:
            console.error("CLIENT_UNKNOWN_ERROR");
            break;
         case ErrorCodes.NO_CONNECTION_ERROR:
            console.error("NO_CONNECTION_ERROR");
            break;
         case ErrorCodes.SERVER_UNKNOWN_ERROR:
            console.error("SERVER_UNKNOWN_ERROR");
            break;
         case ErrorCodes.SERVER_CONNECT_TIMEOUT_ERROR:
            this.router.navigate(['error-599']);
            break;
      }
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