/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'vo-lib-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
})
export class BackButtonComponent {
  @Input()
  public navigateCommands: any[] = [];

  constructor(private readonly router: Router, private readonly route: ActivatedRoute) {}

  public async back(): Promise<void> {
    await this.router.navigate(!!this.navigateCommands && !!this.navigateCommands.length ? this.navigateCommands : ['..'], {
      relativeTo: this.route,
    });
  }
}
