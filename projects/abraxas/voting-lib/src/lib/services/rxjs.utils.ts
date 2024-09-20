/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { defer, Observable, OperatorFunction, timer } from 'rxjs';
import { retry, tap } from 'rxjs/operators';

const waitTime = 200;
const maxWaitTime = 30000; // 30 seconds

export function retryForeverWithBackoff<T>(onRetry?: () => {}): OperatorFunction<T, T> {
  return (src: Observable<T>) =>
    defer(() => {
      // retry on failure after timeout
      return src.pipe(
        retry({
          delay: (error, retryCount) => {
            const retryIn = getWaitTime(retryCount);
            return timer(retryIn).pipe(
              tap(() => {
                if (onRetry) {
                  onRetry();
                }
              }),
            );
          },
          resetOnSuccess: true,
        }),
      );
    });
}

function getWaitTime(attempt: number): number {
  return Math.min(waitTime * Math.pow(2, attempt), maxWaitTime);
}
