/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarkdownString } from '../../models/markdown.model';

@Component({
  selector: 'vo-lib-markdown-preview',
  imports: [FormsModule],
  templateUrl: './markdown-preview.component.html',
  styleUrl: './markdown-preview.component.scss',
})
export class MarkdownPreviewComponent {
  @Input({ required: true })
  public markdown!: MarkdownString;
}
