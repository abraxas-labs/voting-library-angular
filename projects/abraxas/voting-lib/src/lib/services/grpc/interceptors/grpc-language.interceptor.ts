/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable } from '@angular/core';
import { Metadata } from 'grpc-web';
import { Observable } from 'rxjs';
import { LanguageService } from '../../language.service';
import { GrpcInterceptor } from '../grpc-interceptor';
import { GrpcHandler } from '../grpc-handler';

const languageHeader = 'x-language';

@Injectable({ providedIn: 'root' })
export class GrpcLanguageInterceptor implements GrpcInterceptor {
  constructor(private readonly languageService: LanguageService) {}

  public intercept(req: unknown, metadata: Metadata, next: GrpcHandler): Observable<any> {
    metadata[languageHeader] = this.languageService.currentLanguage;
    return next.handle(req, metadata);
  }
}
