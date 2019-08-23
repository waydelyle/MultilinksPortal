import { Injectable } from "@angular/core";
import { HttpRequest, HttpInterceptor, HttpHandler, HttpEvent }
   from "@angular/common/http";
import { Observable } from "rxjs";
import { MultilinksIdentityService } from '../services/multilinks-identity.service';

@Injectable()
export class AddAuthorizationHeaderInterceptor implements HttpInterceptor {

   constructor(private identityService: MultilinksIdentityService) {
   }

   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

      // add the access token as bearer token
      request = request.clone(
         {
            setHeaders: {
               Authorization: this.identityService.user.token_type
                  + " " + this.identityService.user.access_token
            }
         }
      );

      return next.handle(request);
   }
}
