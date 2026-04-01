/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ColorTokensThemes, StylingService } from '@abraxas/base-components';

const defaultTheme = 'default';
const sgTheme = 'sg';
const supportedThemes = [defaultTheme, sgTheme];
const customThemeLogoMapping: Record<string, string> = {
  sg: 'assets/voting-lib/whitelabeling-logos/sg.svg',
};
const storageKey = 'last-used-theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  public static readonly NoTheme = '-';

  private readonly stylingService = inject(StylingService);

  public readonly theme$ = new BehaviorSubject<string | undefined>(undefined);
  public readonly logo$ = new BehaviorSubject<string | undefined>(undefined);

  public trySetTheme(theme: string): boolean {
    // No theme was explicitly set. Try to load the last used theme
    if (theme === ThemeService.NoTheme) {
      theme = localStorage.getItem(storageKey) ?? defaultTheme;
    }

    let result = true;

    // Unknown themes should just use the default theme, otherwise no colors etc. would be displayed
    if (!supportedThemes.includes(theme)) {
      console.error(`Theme ${theme} is not a supported theme.`);
      theme = defaultTheme;
      result = false;
    }

    if (theme === sgTheme) {
      this.stylingService.setTheme(ColorTokensThemes.SGKantonLight);
    } else if (theme === defaultTheme) {
      this.stylingService.setTheme(ColorTokensThemes.AbraxasLight);
    } else {
      this.stylingService.setTheme(theme);
    }

    if (theme !== this.theme$.value) {
      this.theme$.next(theme);
      localStorage.setItem(storageKey, theme);

      const logo = customThemeLogoMapping[theme];
      if (logo !== this.logo$.value) {
        this.logo$.next(logo);
      }
    }

    return result;
  }

  public setTheme(theme: string): string {
    this.trySetTheme(theme);
    return this.theme$.value!;
  }
}
