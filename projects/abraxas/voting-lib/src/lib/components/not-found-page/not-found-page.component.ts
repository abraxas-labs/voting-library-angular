/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, inject } from '@angular/core';
import { ErrorPageModule } from '@abraxas/base-components';
import { TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'vo-lib-not-found-page',
  imports: [ErrorPageModule, TranslatePipe],
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.scss',
})
export class NotFoundPageComponent {
  private readonly router = inject(Router);

  protected async back(): Promise<void> {
    await this.router.navigate(['/']);
  }
}
