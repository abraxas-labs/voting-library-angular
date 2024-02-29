/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { AuthorizationService } from '@abraxas/base-components';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { REST_API_URL } from '../../../tokens';

const tenantKey = 'x-tenant';

@Injectable({
  providedIn: 'root',
})
export class HttpTenantInterceptor implements HttpInterceptor {
  constructor(private readonly authService: AuthorizationService, @Inject(REST_API_URL) private readonly restApiUrl: string | undefined) {}

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.restApiUrl || !req.url.includes(this.restApiUrl) || !!req.headers.get(tenantKey)) {
      return next.handle(req);
    }

    return from(this.authService.getActiveTenant()).pipe(
      switchMap(tenant => {
        return next.handle(
          req.clone({
            setHeaders: { [tenantKey]: tenant.id },
          }),
        );
      }),
    );
  }
}
