/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

export interface MarkdownString {
  markdown: string;
  html: string;
}

export type MarkdownEditorFormattingOption = 'bold' | 'italic' | 'strikethrough' | 'superscript';

export const DEFAULT_MARKDOWN_EDITOR_FORMATTING_OPTIONS: ReadonlyArray<MarkdownEditorFormattingOption> = [
  'bold',
  'italic',
  'strikethrough',
  'superscript',
];
