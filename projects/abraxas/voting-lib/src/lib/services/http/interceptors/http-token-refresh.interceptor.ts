/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable, from, switchMap } from 'rxjs';
import { REST_API_URL } from '../../../tokens';

const authorizationKey = 'Authorization';

/**
 * Http interceptor for authentication services. This interceptor manually
 * triggers a token refresh flow if no valid access token is present.
 * A manual token refresh is only required if the underlying
 * oidc library fails to trigger the automated refresh token.
 * Issue: https://github.com/manfredsteyer/angular-oauth2-oidc/issues/1038
 */
@Injectable({
  providedIn: 'root',
})
export class HttpTokenRefreshInterceptor implements HttpInterceptor {
  constructor(private oauthService: OAuthService, @Inject(REST_API_URL) private readonly restApiUrl: string | undefined) {}

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.restApiUrl || !req.url.includes(this.restApiUrl) || !!req.headers.get(authorizationKey)) {
      return next.handle(req);
    }

    if (this.oauthService.hasValidAccessToken()) {
      // skip manual token refresh if s valid access token is present
      return next.handle(req);
    }

    if (!this.oauthService.getRefreshToken()) {
      // skip manual token refresh if no refresh token is present
      return next.handle(req);
    }

    // enforce manual refresh token flow if the automated refresh flow
    // is not working properly or has failed unexpectedly.
    return from(this.oauthService.refreshToken()).pipe(switchMap(() => next.handle(req)));
  }
}
