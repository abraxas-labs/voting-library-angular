/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const supportedThemes = ['default', 'sg'];
const defaultTheme = 'default';
const themeAttributeName = 'data-theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private currentTheme?: string;
  private readonly renderer: Renderer2;
  public readonly theme$ = new BehaviorSubject<string | undefined>(undefined);

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  public setTheme(name: string) {
    // Unknown themes should just use the default theme, otherwise no colors etc. would be displayed
    if (!supportedThemes.includes(name)) {
      console.error(`Theme ${name} is not a supported theme.`);
      name = defaultTheme;
    }

    if (name == this.currentTheme) {
      return;
    }

    this.currentTheme = name;
    this.renderer.setAttribute(document.documentElement, themeAttributeName, name);
    this.theme$.next(this.currentTheme);
  }
}
