/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Sync validators.
 * All validators don't validate whether a string is trimmed.
 * To include trimmed support, use async variants.
 */
export class InputValidators {
  public static readonly phoneRegex: RegExp = /^\+?(?:[1-9]\s*){0,3}\s?(?:\d\s?){7,14}$/;
  public static readonly numericRegex: RegExp = /^\d+$/;
  public static readonly alphaRegex: RegExp = /^[\p{L}\p{M}]+$/u;
  public static readonly alphaWhiteRegex: RegExp = /^[\p{L}\p{M} ]+$/u;
  public static readonly alphaNumWhiteRegex: RegExp = /^[\p{L}\p{M}\p{Nd} ]+$/u;
  public static readonly simpleSlTextRegex: RegExp = /^[\p{L}\p{M}\p{Nd} .'-]+$/u;
  public static readonly simpleMlTextRegex: RegExp = /^[\p{L}\p{M}\p{Nd} .'\-\r\n]+$/u;
  public static readonly complexSlTextRegex: RegExp = /^[\p{L}\p{M}\p{Nd} _!?+\-@,.:()/—'"«»;&–`´’‘*%=§\x5B\x5D±]+$/u;
  public static readonly complexMlTextRegex: RegExp = /^[\p{L}\p{M}\p{Nd}\r\n _!?+\-@,.:()/—'"«»;&–`´’‘*%=§\x5B\x5D±]+$/u;
  public static readonly markdownTextRegex: RegExp =
    /^(?:[\p{L}\p{M}\p{Nd}\r\n\t _!?+\-@,.:()/\\—'"«»;&–`´’‘*%=§\x5B\x5D±~]|<br>|<br\s*\/>|<sup>|<\/sup>)+$/u;

  public static phone(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    if (!value) {
      return null;
    }

    const valid = InputValidators.phoneRegex.test(value);
    return valid ? null : { phone: true };
  }

  public static numeric(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    if (!value) {
      return null;
    }

    const valid = InputValidators.numericRegex.test(value);
    return valid ? null : { numeric: true };
  }

  public static alpha(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    if (!value) {
      return null;
    }

    const valid = InputValidators.alphaRegex.test(value);
    return valid ? null : { alpha: true };
  }

  public static alphaWhite(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    if (!value) {
      return null;
    }

    const valid = InputValidators.alphaWhiteRegex.test(value);
    return valid ? null : { alphaWhite: true };
  }

  public static alphaNumWhite(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    if (!value) {
      return null;
    }

    const valid = InputValidators.alphaNumWhiteRegex.test(value);
    return valid ? null : { alphaNumWhite: true };
  }

  public static simpleSlText(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    if (!value) {
      return null;
    }

    const valid = InputValidators.simpleSlTextRegex.test(value);
    return !valid ? { simpleSlText: true } : null;
  }

  public static simpleMlText(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    if (!value) {
      return null;
    }

    const valid = InputValidators.simpleMlTextRegex.test(value);
    return !valid ? { simpleMlText: true } : null;
  }

  public static complexSlText(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    if (!value) {
      return null;
    }

    const valid = InputValidators.complexSlTextRegex.test(value);
    return !valid ? { complexSlText: true } : null;
  }

  public static complexMlText(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    if (!value) {
      return null;
    }

    const valid = InputValidators.complexMlTextRegex.test(value);
    return !valid ? { complexMlText: true } : null;
  }

  public static markdownText(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    if (!value) {
      return null;
    }

    const valid = InputValidators.markdownTextRegex.test(value);
    return !valid ? { markdownText: true } : null;
  }

  public static httpsUrl(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    if (!value) {
      return null;
    }

    let valid;
    try {
      const url = new URL(value);
      valid = url.protocol === 'https:';
    } catch {
      valid = false;
    }
    return !valid ? { httpsUrl: true } : null;
  }
}
