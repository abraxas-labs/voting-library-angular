/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { AuthenticationConfig } from '@abraxas/base-components';
import { Injectable } from '@angular/core';
import { Metadata } from 'grpc-web';
import { Observable } from 'rxjs';
import { GrpcHandler } from '../grpc-handler';
import { GrpcInterceptor } from '../grpc-interceptor';

const appKey = 'x-app';

@Injectable({ providedIn: 'root' })
export class GrpcAppInterceptor implements GrpcInterceptor {
  constructor(private readonly config: AuthenticationConfig) {}

  public intercept(req: unknown, metadata: Metadata, next: GrpcHandler): Observable<any> {
    if (!metadata[appKey]) {
      metadata[appKey] = this.config.clientId ?? '';
    }

    return next.handle(req, metadata);
  }
}
