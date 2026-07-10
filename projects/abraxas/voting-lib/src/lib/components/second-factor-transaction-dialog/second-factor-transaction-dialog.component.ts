/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { AlertBarModule, ButtonModule, DialogModule, IconButtonModule, SpinnerModule } from '@abraxas/base-components';
import { SecondFactorTransactionNevisInfo, SecondFactorTransactionProvider } from '../../models/second-factor-transaction.model';
import { SecondFactorTransactionNevisComponent } from '../second-factor-transaction-nevis/second-factor-transaction-nevis.component';
import { SecondFactorTransactionOtpComponent } from '../second-factor-transaction-otp/second-factor-transaction-otp.component';

@Component({
  selector: 'vo-lib-second-factor-transaction-dialog',
  templateUrl: './second-factor-transaction-dialog.component.html',
  styleUrl: './second-factor-transaction-dialog.component.scss',
  standalone: true,
  imports: [
    SecondFactorTransactionNevisComponent,
    SecondFactorTransactionOtpComponent,
    TranslatePipe,
    ButtonModule,
    SpinnerModule,
    DialogModule,
    IconButtonModule,
    AlertBarModule,
  ],
})
export class SecondFactorTransactionDialogComponent {
  private readonly dialogRef =
    inject<MatDialogRef<SecondFactorTransactionDialogComponent, SecondFactorTransactionDialogResult>>(MatDialogRef);

  @ViewChild(SecondFactorTransactionNevisComponent) public nevisComponent?: SecondFactorTransactionNevisComponent;
  @ViewChild(SecondFactorTransactionOtpComponent) public otpComponent?: SecondFactorTransactionOtpComponent;

  public readonly SecondFactorTransactionProvider = SecondFactorTransactionProvider;

  public hasError: boolean = false;
  public nevisInfo?: SecondFactorTransactionNevisInfo;
  public nevisAvailable: boolean = false;
  public otpAvailable: boolean = false;
  public activeProvider: SecondFactorTransactionProvider = SecondFactorTransactionProvider.UNSPECIFIED;
  public action?: (otpCode?: string) => Observable<unknown>;

  public get otpSubmitDisabled(): boolean {
    if (!this.otpComponent) {
      return true;
    }
    const code = this.otpComponent.otpCode != null ? String(this.otpComponent.otpCode) : '';
    return code.length !== 6 || this.otpComponent.isSubmitting;
  }

  public otherProviders: SecondFactorTransactionProvider[] = [];
  private availableProviders: SecondFactorTransactionProvider[] = [];

  constructor() {
    const dialogData = inject<SecondFactorTransactionDialogData>(MAT_DIALOG_DATA);

    this.nevisInfo = dialogData.nevisInfo;
    this.nevisAvailable = dialogData.availableProviders?.includes(SecondFactorTransactionProvider.NEVIS) ?? false;
    this.otpAvailable = dialogData.availableProviders?.includes(SecondFactorTransactionProvider.OTP) ?? false;
    this.availableProviders = (dialogData.availableProviders ?? []).filter(p => p !== SecondFactorTransactionProvider.UNSPECIFIED);
    this.action = dialogData.action;

    if (this.nevisAvailable && !this.nevisInfo) {
      throw new Error('Nevis is available but no nevis info provided');
    }

    if (this.nevisAvailable) {
      this.setActiveProvider(SecondFactorTransactionProvider.NEVIS);
    } else if (this.otpAvailable) {
      this.setActiveProvider(SecondFactorTransactionProvider.OTP);
    }
  }

  private setActiveProvider(provider: SecondFactorTransactionProvider): void {
    this.activeProvider = provider;
    this.otherProviders = this.availableProviders.filter(p => p !== provider);
  }

  public onVerified(): void {
    this.dialogRef.close({ verified: true });
  }

  public onErrored(err: unknown): void {
    this.hasError = true;
    this.dialogRef.close({ verified: false, error: err });
  }

  public switchProvider(provider: SecondFactorTransactionProvider): void {
    if (provider === SecondFactorTransactionProvider.NEVIS) {
      this.nevisComponent?.startPolling();
    } else {
      this.nevisComponent?.stopPolling();
    }

    this.setActiveProvider(provider);
  }

  public cancel(): void {
    this.nevisComponent?.stopPolling();
    this.dialogRef.close({ verified: false });
  }
}

export interface SecondFactorTransactionDialogData {
  nevisInfo?: SecondFactorTransactionNevisInfo;
  availableProviders?: SecondFactorTransactionProvider[];
  action?: (otpCode?: string) => Observable<unknown>;
}

export interface SecondFactorTransactionDialogResult {
  verified: boolean;
  error?: unknown;
}
