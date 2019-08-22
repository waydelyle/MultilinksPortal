export class ExponentialBackoffRetry {

   /* Fixed parameters */
   initialInterval!: number;
   maxInterval!: number;
   maxRetries!: number;
   additionalMaxRandomHoldoff!: number;

   currentRetries!: number;
   totalHoldoffInterval!: number;
   retryCompleted!: boolean;
}
