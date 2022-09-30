/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { ChangeDetectionStrategy, Component, Inject, InjectionToken } from '@angular/core';
import { Environments } from '../../models/environments.enum';

export const ENV_INJECTION_TOKEN: InjectionToken<string> = new InjectionToken<string>('environment short name');

@Component({
  selector: 'vo-lib-environment-chip',
  templateUrl: './environment-chip.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnvironmentChipComponent {
  public readonly color: string;
  public readonly foregroundColor: 'dark' | 'light' = 'dark';
  public readonly isProd: boolean;

  constructor(@Inject(ENV_INJECTION_TOKEN) public env: Environments) {
    this.isProd = env === Environments.prod || env === Environments.pro;

    this.color = '#f00';
    switch (env) {
      case Environments.arc:
      case Environments.pre:
        this.color = '#1c9048'; // success
        this.foregroundColor = 'light';
        break;
      case Environments.sta:
      case Environments.uat:
      case Environments.bbt:
        this.color = '#ffa000'; // warning
        this.foregroundColor = 'dark';
        break;
      default: // info
        this.color = '#1c69ce';
        this.foregroundColor = 'light';
        break;
    }
  }
}
