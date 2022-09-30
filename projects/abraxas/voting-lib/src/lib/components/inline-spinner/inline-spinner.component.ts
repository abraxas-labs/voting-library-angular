/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { SpinnerSize } from '@abraxas/base-components';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'vo-lib-inline-spinner',
  templateUrl: './inline-spinner.component.html',
  styleUrls: ['./inline-spinner.component.scss'],
})
export class InlineSpinnerComponent {
  @Input()
  public loading: boolean = false;

  @Input()
  public size: SpinnerSize = 'default';

  @Input()
  public spinnerClass: string = '';

  @Input()
  public position: 'left' | 'right' = 'right';
}
