/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { AuthorizationService } from '@abraxas/base-components';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { REST_API_URL } from '../../../tokens';

const tenantKey = 'x-tenant';

@Injectable({
  providedIn: 'root',
})
export class HttpTenantInterceptor implements HttpInterceptor {
  private readonly authService = inject(AuthorizationService);
  private readonly restApiUrl = inject(REST_API_URL);

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
