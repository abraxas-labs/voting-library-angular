/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { InjectionToken } from '@angular/core';
import { GrpcErrorMapper } from './services/global-error-handler.service';

export const SEARCH_DEBOUNCE_TIME: InjectionToken<number> = new InjectionToken<number>('debounce time for searches');
export const REST_API_URL: InjectionToken<string | undefined> = new InjectionToken<string | undefined>('rest api url');

export const GRPC_ERROR_MAPPER: InjectionToken<GrpcErrorMapper> = new InjectionToken<GrpcErrorMapper>('grpc error mapper');

export const NOT_FOUND_ERROR_URL: InjectionToken<string> = new InjectionToken<string>('not found url');
export const PERMISSION_DENIED_ERROR_URL: InjectionToken<string> = new InjectionToken<string>('permission denied url');

export const ERROR_STATUS_CODE_URL_MAPPING: InjectionToken<Record<number, string>> = new InjectionToken<Record<number, string>>(
  'error status code url mapping',
);
