import { Injectable } from "@angular/core";
import { ExponentialBackoffRetry } from "../models/exponential-backoff-retry.model";

@Injectable()
export class ExponentialBackoffRetryService {

   updateExponentialBackoffRetryData(retryData: ExponentialBackoffRetry): ExponentialBackoffRetry {
      if (retryData.retryCompleted) {
         return retryData;
      }

      if (retryData.currentRetries >= retryData.maxRetries) {
         retryData.retryCompleted = true;
         return retryData;
      }

      retryData.currentRetries += 1;
      retryData.totalHoldoffInterval = Math.pow(retryData.initialInterval, retryData.currentRetries) +
         Math.floor(Math.random() * retryData.additionalMaxRandomHoldoff);

      if (retryData.totalHoldoffInterval > retryData.maxInterval) {
         retryData.totalHoldoffInterval = retryData.maxInterval;
      }

      return retryData;
   }

   resetExponentialBackoffRetryData(retryData: ExponentialBackoffRetry): ExponentialBackoffRetry {
      retryData.currentRetries = 0;
      retryData.totalHoldoffInterval = 0;
      retryData.retryCompleted = false;

      return retryData;
   }
}
