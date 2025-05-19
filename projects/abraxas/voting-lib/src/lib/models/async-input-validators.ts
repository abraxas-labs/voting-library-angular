/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// Use an async validator with debounce to avoid invalid state caused by space entry and trim validation.
export class AsyncInputValidators {
  public static simpleSlTextRegex: RegExp = /^[\p{L}\p{M}\p{Nd} .'-]+$/u;
  public static simpleMlTextRegex: RegExp = /^[\p{L}\p{M}\p{Nd} .'\-\r\n]+$/u;
  public static complexSlTextRegex: RegExp = /^[\p{L}\p{M}\p{Nd} _!?+\-@,\.:'()\/—'«»;&–`´’‘+*%=]+$/u;
  public static complexMlTextRegex: RegExp = /^[\p{L}\p{M}\p{Nd}\r\n _!?+\-@,\.:'()\/—'«»;&–`´’‘+*%=]+$/u;
  public static untrimmedRegex: RegExp = /(^\s)|(\s$)/;

  private static validationDebounce: number = 500;

  public static simpleSlText(control: AbstractControl): Observable<ValidationErrors | null> {
    return timer(AsyncInputValidators.validationDebounce).pipe(
      switchMap(() => {
        const value = control.value as string;
        if (!value) {
          return of(null);
        }

        const valid = AsyncInputValidators.simpleSlTextRegex.test(value);
        const untrimmed = AsyncInputValidators.untrimmedRegex.test(value);
        const result = !valid
          ? untrimmed
            ? { simpleSlText: true, untrimmed: true }
            : { simpleSlText: true }
          : untrimmed
            ? { untrimmed: true }
            : null;
        return of(result);
      }),
    );
  }

  public static simpleMlText(control: AbstractControl): Observable<ValidationErrors | null> {
    return timer(AsyncInputValidators.validationDebounce).pipe(
      switchMap(() => {
        const value = control.value as string;
        if (!value) {
          return of(null);
        }

        const valid = AsyncInputValidators.simpleMlTextRegex.test(value);
        const untrimmed = AsyncInputValidators.untrimmedRegex.test(value);
        const result = !valid
          ? untrimmed
            ? { simpleMlText: true, untrimmed: true }
            : { simpleMlText: true }
          : untrimmed
            ? { untrimmed: true }
            : null;
        return of(result);
      }),
    );
  }

  public static complexSlText(control: AbstractControl): Observable<ValidationErrors | null> {
    return timer(AsyncInputValidators.validationDebounce).pipe(
      switchMap(() => {
        const value = control.value as string;
        if (!value) {
          return of(null);
        }

        const valid = AsyncInputValidators.complexSlTextRegex.test(value);
        const untrimmed = AsyncInputValidators.untrimmedRegex.test(value);
        const result = !valid
          ? untrimmed
            ? { complexSlText: true, untrimmed: true }
            : { complexSlText: true }
          : untrimmed
            ? { untrimmed: true }
            : null;
        return of(result);
      }),
    );
  }

  public static complexMlText(control: AbstractControl): Observable<ValidationErrors | null> {
    return timer(AsyncInputValidators.validationDebounce).pipe(
      switchMap(() => {
        const value = control.value as string;
        if (!value) {
          return of(null);
        }

        const valid = AsyncInputValidators.complexMlTextRegex.test(value);
        const untrimmed = AsyncInputValidators.untrimmedRegex.test(value);
        const result = !valid
          ? untrimmed
            ? { complexMlText: true, untrimmed: true }
            : { complexMlText: true }
          : untrimmed
            ? { untrimmed: true }
            : null;
        return of(result);
      }),
    );
  }
}
