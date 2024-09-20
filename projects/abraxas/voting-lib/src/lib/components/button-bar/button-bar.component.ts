/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { ButtonComponent } from '@abraxas/base-components';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'vo-lib-button-bar',
  templateUrl: './button-bar.component.html',
  styleUrls: ['./button-bar.component.scss'],
})
export class ButtonBarComponent {
  @Input()
  public saving: boolean = false;

  @Input()
  public saveLabel?: string;

  @Input()
  public saveIcon?: string;

  @Input()
  public canSave: boolean = true;

  @Input()
  public hasSaveButton: boolean = true;

  @Input()
  public hasCancelButton: boolean = true;

  @Input()
  public cancelLabel?: string;

  @Output()
  public cancel: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  public save: EventEmitter<void> = new EventEmitter<void>();

  @Input()
  public sticky: boolean = true;

  @ViewChild('saveButton', { static: false })
  private saveButton?: ButtonComponent;

  public setSaveFocus(): void {
    this.saveButton?.setFocus();
  }
}
