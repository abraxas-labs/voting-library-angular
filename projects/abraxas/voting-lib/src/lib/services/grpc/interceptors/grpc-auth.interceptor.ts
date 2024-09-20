/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { AuthStorageService } from '@abraxas/base-components';
import { Injectable } from '@angular/core';
import { Metadata } from 'grpc-web';
import { Observable } from 'rxjs';
import { GrpcHandler } from '../grpc-handler';
import { GrpcInterceptor } from '../grpc-interceptor';

const authorizationKey = 'Authorization';
const bearerPrefix = 'Bearer ';
const accessTokenStorageField = 'access_token';

function noAccessTokenPresent(): never {
  throw new Error('Access Token is null.');
}

@Injectable({ providedIn: 'root' })
export class GrpcAuthInterceptor implements GrpcInterceptor {
  constructor(private readonly authStorage: AuthStorageService) {}

  public intercept(req: unknown, metadata: Metadata, next: GrpcHandler): Observable<any> {
    const accessToken = this.authStorage.getItem(accessTokenStorageField) ?? noAccessTokenPresent();
    // We need to overwrite the authorization explicitly. Otherwise the retry via observable doesn't work, since the
    // existing metadata contains stale authorization data.
    metadata[authorizationKey] = bearerPrefix + accessToken;
    return next.handle(req, metadata);
  }
}
