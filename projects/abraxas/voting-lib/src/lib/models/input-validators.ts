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
  public static phoneRegex: RegExp = /^\+?(?:[1-9]\s*){0,3}\s?(?:[0-9]\s?){7,14}$/;
  public static numericRegex: RegExp = /^\d+$/;
  public static alphaRegex: RegExp = /^[\p{L}\p{M}]+$/u;
  public static alphaWhiteRegex: RegExp = /^[\p{L}\p{M} ]+$/u;
  public static alphaNumWhiteRegex: RegExp = /^[\p{L}\p{M}\p{Nd} ]+$/u;
  public static simpleSlTextRegex: RegExp = /^[\p{L}\p{M}\p{Nd} .'-]+$/u;
  public static simpleMlTextRegex: RegExp = /^[\p{L}\p{M}\p{Nd} .'\-\r\n]+$/u;
  public static complexSlTextRegex: RegExp = /^[\p{L}\p{M}\p{Nd} _!?+\-@,\.:'()\/—'"«»;&–`´’‘+*%=§\[\]]+$/u;
  public static complexMlTextRegex: RegExp = /^[\p{L}\p{M}\p{Nd}\r\n _!?+\-@,\.:'()\/—'"«»;&–`´’‘+*%=§\[\]]+$/u;

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
}
