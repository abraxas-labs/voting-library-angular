/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'vo-lib-action-menu-item',
  templateUrl: './action-menu-item.component.html',
  styleUrls: [],
  standalone: false,
})
export class ActionMenuItemComponent {
  @Input()
  public icon: string = '';

  @Input()
  public text: string = '';

  @Input()
  public disabled: boolean = false;

  @Output()
  public action: EventEmitter<void> = new EventEmitter();
}
