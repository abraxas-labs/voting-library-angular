/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'vo-lib-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  standalone: false,
})
export class DialogComponent {
  @Input()
  public contentLoading: boolean = false;

  @Input()
  public header: string = '';

  @Output()
  public dialogClose: EventEmitter<void> = new EventEmitter();
}
