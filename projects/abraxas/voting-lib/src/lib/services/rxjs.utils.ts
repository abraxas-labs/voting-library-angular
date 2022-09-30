/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { defer, Observable, OperatorFunction, timer } from 'rxjs';
import { concatMap, retryWhen, tap } from 'rxjs/operators';

const waitTime = 200;
const maxWaitTime = 30000; // 30 seconds

function getWaitTime(attempt: number): number {
  return Math.min(waitTime * Math.pow(2, attempt), maxWaitTime);
}

export function retryForeverWithBackoff<T>(): OperatorFunction<T, T> {
  return (src: Observable<T>) =>
    defer(() => {
      let attempts = 0;

      // retry on failure after timeout
      return src.pipe(
        retryWhen(errs =>
          errs.pipe(
            concatMap(() => {
              attempts++;
              const retryIn = getWaitTime(attempts);
              return timer(retryIn);
            }),
          ),
        ),

        // reset attempts on successful emit
        tap(() => (attempts = 0)),
      );
    });
}
