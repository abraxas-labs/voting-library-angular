/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationConfig, IsAuthenticatedGuard } from '@abraxas/base-components';
import { ThemeService } from '../services/theme.service';

export function ThemeGuard(
  onUnknownTheme?: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => MaybeAsync<GuardResult>,
): CanActivateFn {
  return function (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    const service = inject(ThemeService);
    const ok = service.trySetTheme(route.params.theme);
    if (!ok && onUnknownTheme) {
      return onUnknownTheme(route, state);
    }

    return true;
  };
}
