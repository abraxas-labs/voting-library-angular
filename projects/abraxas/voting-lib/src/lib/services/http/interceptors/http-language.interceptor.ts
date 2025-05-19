/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LanguageService } from '../../language.service';
import { REST_API_URL } from '../../../tokens';

const languageHeader = 'x-language';

@Injectable({
  providedIn: 'root',
})
export class HttpLanguageInterceptor implements HttpInterceptor {
  constructor(
    private readonly languageService: LanguageService,
    @Inject(REST_API_URL) private readonly restApiUrl: string | undefined,
  ) {}

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.restApiUrl || !req.url.includes(this.restApiUrl)) {
      return next.handle(req);
    }

    return next.handle(
      req.clone({
        setHeaders: { [languageHeader]: this.languageService.currentLanguage },
      }),
    );
  }
}
