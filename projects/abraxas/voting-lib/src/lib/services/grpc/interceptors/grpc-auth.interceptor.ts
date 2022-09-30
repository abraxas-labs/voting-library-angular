/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
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
    if (!metadata[authorizationKey]) {
      const accessToken = this.authStorage.getItem(accessTokenStorageField) ?? noAccessTokenPresent();
      metadata[authorizationKey] = bearerPrefix + accessToken;
    }

    return next.handle(req, metadata);
  }
}
