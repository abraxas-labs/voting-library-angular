/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { InputValidators } from './input-validators';

// Use an async validator with debounce to avoid invalid state caused by space entry and trim validation.
export class AsyncInputValidators {
  public static simpleSlTextRegex = InputValidators.simpleSlTextRegex;
  public static simpleMlTextRegex: RegExp = InputValidators.simpleMlTextRegex;
  public static complexSlTextRegex: RegExp = InputValidators.complexSlTextRegex;
  public static complexMlTextRegex: RegExp = InputValidators.complexMlTextRegex;
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
