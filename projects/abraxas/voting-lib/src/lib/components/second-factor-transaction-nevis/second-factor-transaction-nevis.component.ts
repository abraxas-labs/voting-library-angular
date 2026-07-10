/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, of, Subscription, throwError } from 'rxjs';
import { retry } from 'rxjs/operators';
import { ButtonModule, SpinnerModule } from '@abraxas/base-components';
import { SecondFactorTransactionNevisInfo } from '../../models/second-factor-transaction.model';
import { isErrorType } from '../../services/grpc/grpc-error.utils';

const ERROR_TYPE_VERIFY_SECOND_FACTOR = 'VerifySecondFactorTimeoutException';
const RETRY_COUNT = 5;

@Component({
  selector: 'vo-lib-second-factor-transaction-nevis',
  templateUrl: './second-factor-transaction-nevis.component.html',
  standalone: true,
  imports: [TranslatePipe, ButtonModule, SpinnerModule],
})
export class SecondFactorTransactionNevisComponent implements OnInit, OnDestroy {
  @Input() public nevisInfo?: SecondFactorTransactionNevisInfo;
  @Input() public action?: () => Observable<unknown>;

  @Output() public readonly verified = new EventEmitter<void>();
  @Output() public readonly errored = new EventEmitter<unknown>();

  public showNevisQrCode: boolean = false;

  private pollSubscription?: Subscription;

  public ngOnInit(): void {
    this.startPolling();
  }

  public ngOnDestroy(): void {
    this.pollSubscription?.unsubscribe();
  }

  public startPolling(): void {
    if (!this.action) {
      return;
    }

    this.pollSubscription = this.action()
      .pipe(
        retry({
          count: RETRY_COUNT,
          delay: err => {
            if (isErrorType(err, ERROR_TYPE_VERIFY_SECOND_FACTOR)) {
              return of(null);
            }

            return throwError(() => err);
          },
        }),
      )
      .subscribe({
        next: () => this.verified.emit(),
        error: err => this.errored.emit(err),
      });
  }

  public stopPolling(): void {
    this.pollSubscription?.unsubscribe();
    this.pollSubscription = undefined;
  }
}
