/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { InjectionToken } from '@angular/core';

export const SEARCH_DEBOUNCE_TIME: InjectionToken<string> = new InjectionToken<string>('debounce time for searches');
export const REST_API_URL: InjectionToken<string | undefined> = new InjectionToken<string | undefined>('rest api url');
