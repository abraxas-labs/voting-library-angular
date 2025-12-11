/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { AuthenticationConfig } from '@abraxas/base-components';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { REST_API_URL } from '../../../tokens';

const appKey = 'x-app';

@Injectable({
  providedIn: 'root',
})
export class HttpAppInterceptor implements HttpInterceptor {
  private readonly config = inject(AuthenticationConfig);
  private readonly restApiUrl = inject(REST_API_URL);

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.restApiUrl || !req.url.includes(this.restApiUrl) || !!req.headers.get(appKey)) {
      return next.handle(req);
    }

    return next.handle(
      req.clone({
        setHeaders: { [appKey]: this.config.clientId ?? '' },
      }),
    );
  }
}
