/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Metadata } from 'grpc-web';
import { Observable, from, switchMap } from 'rxjs';
import { GrpcInterceptor } from '../grpc-interceptor';
import { GrpcHandler } from '../grpc-handler';

/**
 * Grpc interceptor for authentication services. This interceptor manually
 * triggers a token refresh flow if no valid access token is present.
 * A manual token refresh is only required if the underlying
 * oidc library fails to trigger the automated refresh token.
 * Issue: https://github.com/manfredsteyer/angular-oauth2-oidc/issues/1038
 */
@Injectable({ providedIn: 'root' })
export class GrpcTokenRefreshInterceptor implements GrpcInterceptor {
  private oauthService = inject(OAuthService);

  public intercept(req: HttpRequest<any>, metadata: Metadata, next: GrpcHandler): Observable<any> {
    if (this.oauthService.hasValidAccessToken()) {
      // skip manual token refresh if s valid access token is present
      return next.handle(req, metadata);
    }

    if (!this.oauthService.getRefreshToken()) {
      // skip manual token refresh if no refresh token is present
      return next.handle(req, metadata);
    }

    // enforce manual refresh token flow if the automated refresh flow
    // is not working properly or has failed unexpectedly.
    return from(this.oauthService.refreshToken()).pipe(switchMap(() => next.handle(req, metadata)));
  }
}
