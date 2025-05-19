/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { AbstractControl, ValidationErrors } from '@angular/forms';

export class InputValidators {
  public static phoneRegex: RegExp = /^\+?(?:[1-9]\s*){0,3}\s?(?:[0-9]\s?){7,14}$/;
  public static numericRegex: RegExp = /^\d+$/;
  public static alphaRegex: RegExp = /^[\p{L}\p{M}]+$/u;
  public static alphaWhiteRegex: RegExp = /^[\p{L}\p{M} ]+$/u;
  public static alphaNumWhiteRegex: RegExp = /^[\p{L}\p{M}\p{Nd} ]+$/u;

  private static validationDebounce: number = 500;

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
}
