/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { AlertBarModule, ButtonModule, NumberModule, SpinnerModule, TextModule } from '@abraxas/base-components';
import { isErrorType } from '../../services/grpc/grpc-error.utils';

const ERROR_TYPE_NOT_VERIFIED = 'SecondFactorTransactionNotVerifiedException';

@Component({
  selector: 'vo-lib-second-factor-transaction-otp',
  templateUrl: './second-factor-transaction-otp.component.html',
  standalone: true,
  imports: [TranslatePipe, FormsModule, AlertBarModule, ButtonModule, NumberModule, SpinnerModule, TextModule],
})
export class SecondFactorTransactionOtpComponent {
  @Input()
  public action?: (otpCode: string) => Observable<unknown>;

  @Output()
  public readonly verified = new EventEmitter<void>();

  @Output()
  public readonly errored = new EventEmitter<unknown>();

  public otpCode?: string;
  public hasOtpError: boolean = false;
  public isSubmitting: boolean = false;

  private lastAutoSubmittedOtp?: string;

  public submitOtp(): void {
    if (this.otpCode?.length !== 6 || this.isSubmitting || !this.action) {
      return;
    }

    this.hasOtpError = false;
    this.isSubmitting = true;

    this.action(this.otpCode).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.verified.emit();
      },
      error: err => {
        this.isSubmitting = false;
        if (isErrorType(err, ERROR_TYPE_NOT_VERIFIED)) {
          this.hasOtpError = true;
        } else {
          this.errored.emit(err);
        }
      },
    });
  }

  public onValueChange(value: string | undefined): void {
    if (value?.length === 6 && value !== this.lastAutoSubmittedOtp) {
      this.lastAutoSubmittedOtp = value;
      this.submitOtp();
    }
  }
}
