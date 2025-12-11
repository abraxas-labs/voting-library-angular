/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { AuthStorageService } from '@abraxas/base-components';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { REST_API_URL } from '../../../tokens';

const authorizationKey = 'Authorization';
const bearerPrefix = 'Bearer ';
const accessTokenStorageField = 'access_token';

@Injectable({
  providedIn: 'root',
})
export class HttpAuthInterceptor implements HttpInterceptor {
  private readonly authStorage = inject(AuthStorageService);
  private readonly restApiUrl = inject(REST_API_URL);

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.restApiUrl || !req.url.includes(this.restApiUrl) || !!req.headers.get(authorizationKey)) {
      return next.handle(req);
    }

    const accessToken = this.authStorage.getItem(accessTokenStorageField);
    if (!accessToken) {
      return next.handle(req);
    }

    return next.handle(
      req.clone({
        setHeaders: { [authorizationKey]: `${bearerPrefix}${accessToken}` },
      }),
    );
  }
}
