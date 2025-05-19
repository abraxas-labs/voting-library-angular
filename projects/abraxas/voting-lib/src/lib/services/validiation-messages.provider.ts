/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { BCLanguageService, Language, ValidationMessagesIntl } from '@abraxas/base-components';
import { Injectable, Optional, SkipSelf } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { InterpolatableTranslationObject } from '@ngx-translate/core/lib/translate.service';

@Injectable({
  providedIn: 'root',
})
export class ValidationMessagesProvider extends ValidationMessagesIntl {
  private readonly validationMessagesKey: string = 'VALIDATION_MESSAGES';

  constructor(
    private readonly translateService: TranslateService,
    bcLanguageService: BCLanguageService,
    @Optional() @SkipSelf() parentIntl?: ValidationMessagesIntl,
  ) {
    super(bcLanguageService, parentIntl);
    for (const lang of this.translateService.getLangs()) {
      this.setValidationMessages(lang);
    }
  }

  /**
   * Loads and sets validation error messages for the given language.
   */
  private setValidationMessages(lang: string): void {
    this.translateService.getTranslation(lang).subscribe((translations: InterpolatableTranslationObject) => {
      const validationMessages = translations[this.validationMessagesKey];

      if (!validationMessages) {
        return;
      }

      for (const validationMessageKey of Object.keys(validationMessages)) {
        this.setTranslation(lang as Language, {
          [validationMessageKey]: validationMessages[validationMessageKey],
        });
      }
    });
  }
}
