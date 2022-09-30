/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { AuthorizationService } from '@abraxas/base-components';
import { Injectable } from '@angular/core';
import { Metadata } from 'grpc-web';
import { from, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { GrpcHandler } from '../grpc-handler';
import { GrpcInterceptor } from '../grpc-interceptor';

const tenantKey = 'x-tenant';

@Injectable({ providedIn: 'root' })
export class GrpcTenantInterceptor implements GrpcInterceptor {
  constructor(private readonly authService: AuthorizationService) {}

  public intercept(req: unknown, metadata: Metadata, next: GrpcHandler): Observable<any> {
    if (!metadata[tenantKey]) {
      return from(this.authService.getActiveTenant()).pipe(
        tap(({ id }) => (metadata[tenantKey] = id)),
        switchMap(() => next.handle(req, metadata)),
      );
    }

    return next.handle(req, metadata);
  }
}
