// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
   production: false,
   releaseInfo: {
      type: 'pre-alpha',
      version: '0.01.03'
   },
   multilinksIdentityInfo: {
      oidcInfo: {
         authority:                       'https://localhost:44300',
         client_id:                       '54b8b2f7-cb54-44c0-905d-467522c7988f',
         redirect_uri:                    'https://localhost:44302/identity-signin-callback',
         post_logout_redirect_uri:        'https://localhost:44302/identity-signout-callback',
         silent_redirect_uri:             'https://localhost:44302/identity-silent-renew-callback',
         response_type:                   'code',
         scope:                           'openid profile roles ApiService',
         automaticSilentRenew:            true
      },
      device_name:                        'Web%20Portal',
      registerEndpoint:                   'https://localhost:44300/account/register'
   },
   multilinksCoreInfo: {
      loginEndpoint:                      'https://localhost:44301/api/endpoints/login/Web%20Portal',
      linksEndpoint:                      'https://localhost:44301/api/endpointlinks',
      notificationsEndpoint:              'https://localhost:44301/api/notifications',
      signalRInfo: {
         retrySetting: {
            initialInterval:              10,
            maxInterval:                  3000,
            maxRetries:                   3,
            additionalMaxRandomHoldoff:   1000
         },
         hubEndpoint:                     'https://localhost:44301/hub/main'
      }
   }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
