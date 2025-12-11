/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'vo-lib-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
  standalone: false,
})
export class BackButtonComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  @Input()
  public navigateCommands: any[] = [];

  public async back(): Promise<void> {
    await this.router.navigate(!!this.navigateCommands && !!this.navigateCommands.length ? this.navigateCommands : ['..'], {
      relativeTo: this.route,
    });
  }
}
