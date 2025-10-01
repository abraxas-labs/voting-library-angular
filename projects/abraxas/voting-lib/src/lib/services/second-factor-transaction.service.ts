/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable } from '@angular/core';
import { RpcError } from 'grpc-web';
import { defer, Observable, of, OperatorFunction, throwError, retry } from 'rxjs';
import {
  SecondFactorTransactionDialogComponent,
  SecondFactorTransactionDialogData,
} from '../components/second-factor-transaction-dialog/second-factor-transaction-dialog.component';
import { DialogService } from '@abraxas/base-components';

const ERROR_TYPE_SEPARATOR = ':';
const ERROR_TYPE_VERIFY_SECOND_FACTOR = 'VerifySecondFactorTimeoutException';
const RETRY_COUNT = 5;

@Injectable({
  providedIn: 'root',
})
export class SecondFactorTransactionService {
  constructor(private readonly dialog: DialogService) {}

  public showDialogAndExecuteVerifyAction<T>(action: () => Observable<T>, data: SecondFactorTransactionDialogData): Promise<void> {
    const dialogRef = this.dialog.open<SecondFactorTransactionDialogComponent>(SecondFactorTransactionDialogComponent, data);

    return new Promise<void>((resolve, reject) => {
      const subscription = action()
        .pipe(this.retryOnVerifyTimeout())
        .subscribe({
          next: () => {
            dialogRef.close();
            resolve();
          },
          error: err => {
            dialogRef.componentInstance.hasError = true;
            reject(err);
          },
        });

      dialogRef.afterClosed().subscribe(() => {
        subscription.unsubscribe();
        reject();
      });
    });
  }

  private retryOnVerifyTimeout<T>(): OperatorFunction<T, T> {
    return (src: Observable<T>) =>
      defer(() => {
        return src.pipe(
          retry({
            count: RETRY_COUNT,
            delay: (err: unknown) => {
              const grpcError = err as RpcError;
              const errorType = grpcError?.message?.split(ERROR_TYPE_SEPARATOR)[0];

              // only retry when it's a VerifySecondFactor timeout; otherwise fail immediately
              if (errorType === ERROR_TYPE_VERIFY_SECOND_FACTOR) {
                // return a notifier observable to trigger the retry
                return of(null);
              }

              return throwError(() => err);
            },
            resetOnSuccess: true,
          }),
        );
      });
  }
}
