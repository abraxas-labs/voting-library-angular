/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AuthenticationConfig, IsAuthenticatedGuard } from '@abraxas/base-components';
import { ThemeService } from '../services/theme.service';

@Injectable({
  providedIn: 'root',
})
export class AuthThemeGuard implements CanActivate {
  constructor(
    private readonly config: AuthenticationConfig,
    private readonly authGuard: IsAuthenticatedGuard,
    private readonly themeService: ThemeService,
  ) {}

  public async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let themeName = route.params.theme;
    themeName = this.themeService.setTheme(themeName);

    // By setting this additional scope, the login page will be white-labeled according to the theme
    this.config.scope = `${this.config.scope} urn:abraxas:iam:hosted_domain:${themeName}`;

    return await this.authGuard.canActivate(route, state);
  }
}
