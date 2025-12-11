/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { BCLanguageService, Language, ValidationMessagesIntl } from '@abraxas/base-components';
import { inject, Injectable } from '@angular/core';
import { InterpolatableTranslationObject, TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ValidationMessagesProvider extends ValidationMessagesIntl {
  private readonly translateService = inject(TranslateService);

  private readonly validationMessagesKey: string = 'VALIDATION_MESSAGES';

  constructor() {
    const bcLanguageService = inject(BCLanguageService);
    const parentIntl = inject(ValidationMessagesIntl, { optional: true, skipSelf: true });

    super(bcLanguageService, parentIntl ?? undefined);
    for (const lang of this.translateService.getLangs()) {
      this.setValidationMessages(lang);
    }
  }

  /**
   * Loads and sets validation error messages for the given language.
   */
  private setValidationMessages(lang: string): void {
    this.translateService.currentLoader.getTranslation(lang).subscribe((translations: InterpolatableTranslationObject) => {
      const validationMessages: any = translations[this.validationMessagesKey];

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
