/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const supportedThemes = ['default', 'sg'];
const defaultTheme = 'default';
const customThemeLogoMapping: Record<string, string> = {
  sg: 'assets/voting-lib/whitelabeling-logos/sg.svg',
};
const themeAttributeName = 'data-theme';
const storageKey = 'last-used-theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  public static readonly NoTheme = '-';

  private readonly renderer: Renderer2;
  public readonly theme$ = new BehaviorSubject<string | undefined>(undefined);
  public readonly logo$ = new BehaviorSubject<string | undefined>(undefined);

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  public setTheme(theme: string): string {
    // No theme was explicitly set. Try to load the last used theme
    if (theme === ThemeService.NoTheme) {
      theme = localStorage.getItem(storageKey) ?? defaultTheme;
    }

    // Unknown themes should just use the default theme, otherwise no colors etc. would be displayed
    if (!supportedThemes.includes(theme)) {
      console.error(`Theme ${theme} is not a supported theme.`);
      theme = defaultTheme;
    }

    if (theme !== this.theme$.value) {
      this.renderer.setAttribute(document.documentElement, themeAttributeName, theme);
      this.theme$.next(theme);
      localStorage.setItem(storageKey, theme);

      const logo = customThemeLogoMapping[theme];
      if (logo !== this.logo$.value) {
        this.logo$.next(logo);
      }
    }

    return theme;
  }
}
