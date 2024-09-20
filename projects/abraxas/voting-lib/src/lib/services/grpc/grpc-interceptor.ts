/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { InjectionToken } from '@angular/core';
import { Metadata } from 'grpc-web';
import { Observable } from 'rxjs';
import { GrpcHandler } from './grpc-handler';

export const GRPC_INTERCEPTORS: InjectionToken<GrpcInterceptor[]> = new InjectionToken<GrpcInterceptor[]>('grpc interceptors (multiple)');

export interface GrpcInterceptor {
  intercept(req: unknown, metadata: Metadata, next: GrpcHandler): Observable<any>;
}
