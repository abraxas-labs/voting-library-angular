/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
  public readonly title: string;
  public readonly message: string;
  public readonly confirmText: string;
  public readonly cancelText: string;
  public readonly showCancel: boolean;

  constructor(
    private readonly dialogRef: MatDialogRef<ConfirmDialogData>,
    @Inject(MAT_DIALOG_DATA) dialogData: ConfirmDialogData,
  ) {
    this.title = dialogData.title;
    this.message = dialogData.message;
    this.showCancel = dialogData.showCancel;

    this.confirmText = dialogData.confirmText ? dialogData.confirmText : 'COMMON.OK';
    this.cancelText = dialogData.cancelText ? dialogData.cancelText : 'COMMON.CANCEL';
  }

  public confirm(): void {
    this.dialogRef.close({ confirmed: true });
  }

  public cancel(): void {
    this.dialogRef.close({ confirmed: false });
  }
}

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  showCancel: boolean;
}

export interface ConfirmDialogResult {
  confirmed: boolean;
}
