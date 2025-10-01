/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Inject } from '@angular/core';
import { VotingLibModule } from '../../voting-lib.module';
import { TranslatePipe } from '@ngx-translate/core';
import { AlertBarModule, ButtonModule, DialogModule, IconButtonModule, SpinnerModule } from '@abraxas/base-components';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgIf } from '@angular/common';

@Component({
  selector: 'vo-lib-second-factor-transaction-dialog',
  imports: [VotingLibModule, TranslatePipe, SpinnerModule, ButtonModule, AlertBarModule, NgIf, DialogModule, IconButtonModule],
  templateUrl: './second-factor-transaction-dialog.component.html',
  styleUrl: './second-factor-transaction-dialog.component.scss',
})
export class SecondFactorTransactionDialogComponent {
  public hasError: boolean = false;
  public correlationCode: string;
  public showQrCode: boolean = false;
  public qrCode: string;

  constructor(
    private readonly dialogRef: MatDialogRef<SecondFactorTransactionDialogData>,
    @Inject(MAT_DIALOG_DATA) dialogData: SecondFactorTransactionDialogData,
  ) {
    this.correlationCode = dialogData.correlationCode;
    this.qrCode = dialogData.qrCode;
  }

  public cancel(): void {
    this.dialogRef.close();
  }
}

export interface SecondFactorTransactionDialogData {
  correlationCode: string;
  qrCode: string;
}
