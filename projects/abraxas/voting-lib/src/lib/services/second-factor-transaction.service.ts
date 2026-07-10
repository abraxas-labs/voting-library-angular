/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DialogService } from './dialog.service';
import {
  SecondFactorTransactionDialogComponent,
  SecondFactorTransactionDialogData,
  SecondFactorTransactionDialogResult,
} from '../components/second-factor-transaction-dialog/second-factor-transaction-dialog.component';
import { SecondFactorTransactionNevisInfo, SecondFactorTransactionProvider } from '../models/second-factor-transaction.model';

@Injectable({
  providedIn: 'root',
})
export class SecondFactorTransactionService {
  private readonly dialog = inject(DialogService);

  /**
   * Shows the second factor transaction dialog and executes the provided action.
   * The action is called with an optional OTP code (for OTP verification) or without arguments (for NEVIS).
   *
   * @param action The action to execute for verification. Receives optional OTP code.
   * @param nevisInfo NEVIS second factor info (QR code etc.), if NEVIS is available.
   * @param availableProviders The available second factor providers.
   * @returns A promise which resolves when the verification is successful, rejects otherwise.
   */
  public async showDialogAndExecuteVerifyAction<T>(
    action: (otpCode?: string) => Observable<T>,
    nevisInfo?: SecondFactorTransactionNevisInfo,
    availableProviders?: SecondFactorTransactionProvider[],
  ): Promise<void> {
    const data: SecondFactorTransactionDialogData = {
      nevisInfo,
      availableProviders,
      action,
    };

    const result = await this.dialog.openForResult<SecondFactorTransactionDialogComponent, SecondFactorTransactionDialogResult>(
      SecondFactorTransactionDialogComponent,
      data,
    );

    if (result?.error) {
      throw result.error;
    }

    if (!result?.verified) {
      throw new Error('Second factor transaction not verified');
    }
  }
}
