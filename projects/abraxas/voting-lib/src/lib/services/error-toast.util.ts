/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorToastUtil {
  constructor(private readonly i18n: TranslateService, private readonly snackbarService: SnackbarService) {}

  public toastError(code: number, errorType: string): void {
    const params = { detail: `Code: ${code ?? ''}` };
    const title = this.getTranslatedOrDefault(`ERRORS.${code}.TITLE`, 'ERRORS.GENERIC.TITLE', params);
    const msg = this.getTranslatedMessage(`ERROR_MESSAGES.${errorType}`, `ERRORS.${code}.MESSAGE`, 'ERRORS.GENERIC.MESSAGE', params);
    this.snackbarService.error(`${title}: ${msg}`);
  }

  private getTranslatedMessage(key: string, fallbackKey: string, defaultKey: string, interpolateParams?: any): string {
    const translated = this.i18n.instant(key, interpolateParams);
    return translated === key ? this.getTranslatedOrDefault(fallbackKey, defaultKey, interpolateParams) : translated;
  }

  private getTranslatedOrDefault(key: string, defaultKey: string, interpolateParams?: any): string {
    const translated = this.i18n.instant(key, interpolateParams);
    return translated === key ? this.i18n.instant(defaultKey, interpolateParams) : translated;
  }
}
