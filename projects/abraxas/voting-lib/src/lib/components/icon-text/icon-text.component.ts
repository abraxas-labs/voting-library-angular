/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'vo-lib-icon-text',
  templateUrl: './icon-text.component.html',
  styleUrls: ['./icon-text.component.scss'],
  standalone: false,
})
export class IconTextComponent {
  @Input()
  public icon: string | undefined;

  @Input()
  public iconBeforeText: boolean = false;

  @Input()
  public iconClickable: boolean = false;

  @Input()
  public showIcon: boolean = true;

  @Output()
  public iconClick: EventEmitter<any> = new EventEmitter();
}
