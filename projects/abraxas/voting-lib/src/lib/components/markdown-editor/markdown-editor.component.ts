/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { ErrorModule, LabelModule, TooltipModule, ValidationMessagesIntl } from '@abraxas/base-components';
import { TranslatePipe } from '@ngx-translate/core';
import { CmdKey, commandsCtx, defaultValueCtx, Editor, editorViewCtx, rootCtx } from '@milkdown/kit/core';
import { commonmark, toggleEmphasisCommand, toggleStrongCommand } from '@milkdown/kit/preset/commonmark';
import { gfm, toggleStrikethroughCommand } from '@milkdown/kit/preset/gfm';
import { listener, listenerCtx } from '@milkdown/kit/plugin/listener';
import { history } from '@milkdown/kit/plugin/history';
import { $prose, replaceAll } from '@milkdown/kit/utils';
import type { MarkType } from '@milkdown/kit/prose/model';
import { Plugin, PluginKey } from '@milkdown/kit/prose/state';
import { Ctx } from '@milkdown/ctx';
import { DEFAULT_MARKDOWN_EDITOR_FORMATTING_OPTIONS, MarkdownEditorFormattingOption } from '../../models/markdown.model';
import {
  remarkSuperscriptMergePlugin,
  superscriptAttr,
  superscriptInputRule,
  superscriptName,
  superscriptSchema,
  toggleSuperscriptCommand,
} from './superscript';

let instanceCounter = 0;

@Component({
  selector: 'vo-lib-markdown-editor',
  templateUrl: './markdown-editor.component.html',
  styleUrls: ['./markdown-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TooltipModule, TranslatePipe, ErrorModule, LabelModule],
})
export class MarkdownEditorComponent implements AfterViewInit, OnDestroy, OnChanges, DoCheck, ControlValueAccessor {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly zone = inject(NgZone);
  private readonly validationMessagesIntl = inject(ValidationMessagesIntl);
  public readonly ngControl = inject(NgControl, { self: true, optional: true });
  public readonly instanceId = instanceCounter++;

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  @ViewChild('editorContainer', { static: true })
  public editorContainer!: ElementRef<HTMLDivElement>;

  @Input()
  public label = '';

  @Input()
  public required = false;

  @Input()
  public readonly = false;

  @Input()
  public error = false;

  @Input()
  public rows = 6;

  @Input()
  public subscriptSizing: 'fixed' | 'dynamic' = 'dynamic';

  @Input()
  public optionalText = 'optional';

  @Input()
  public showDefaultErrors = false;

  @Input()
  public availableFormattingOptions: ReadonlyArray<MarkdownEditorFormattingOption> = DEFAULT_MARKDOWN_EDITOR_FORMATTING_OPTIONS;

  public boldActive = false;
  public italicActive = false;
  public strikethroughActive = false;
  public superscriptActive = false;
  public focused = false;
  public errorMessages: string[] = [];

  private editor?: Editor;
  private value = '';
  private internalUpdate = false;

  private onChange: (value: string) => void = () => {};

  private onTouched: () => void = () => {};

  public writeValue(value: string): void {
    this.value = value ?? '';
    if (this.editor) {
      this.internalUpdate = true;
      this.editor.action(replaceAll(this.value));
      this.internalUpdate = false;
    }
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => void this.initEditor());
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['readonly'] && this.editor) {
      this.updateEditorEditable();
    }
  }

  public ngDoCheck(): void {
    this.updateErrorMessages();
  }

  public ngOnDestroy(): void {
    this.editor?.destroy();
  }

  public focusEditor(): void {
    this.getEditor()?.focus();
  }

  public onContainerClick(event: MouseEvent): void {
    if (this.readonly) {
      return;
    }

    const editor = this.getEditor();
    if (editor && !editor.contains(event.target as Node)) {
      this.focusEditor();
    }
  }

  public toggleBold(): void {
    if (!this.isFormattingOptionEnabled('bold')) {
      return;
    }

    this.editor?.action(ctx => this.callCommand(ctx, toggleStrongCommand.key));
  }

  public toggleItalic(): void {
    if (!this.isFormattingOptionEnabled('italic')) {
      return;
    }

    this.editor?.action(ctx => this.callCommand(ctx, toggleEmphasisCommand.key));
  }

  public toggleStrikethrough(): void {
    if (!this.isFormattingOptionEnabled('strikethrough')) {
      return;
    }

    this.editor?.action(ctx => this.callCommand(ctx, toggleStrikethroughCommand.key));
  }

  public toggleSuperscript(): void {
    if (!this.isFormattingOptionEnabled('superscript')) {
      return;
    }

    this.editor?.action(ctx => this.callCommand(ctx, toggleSuperscriptCommand.key));
  }

  public isFormattingOptionEnabled(option: MarkdownEditorFormattingOption): boolean {
    return this.availableFormattingOptions.includes(option);
  }

  private async initEditor(): Promise<void> {
    const container = this.editorContainer!.nativeElement;
    this.editor = await Editor.make()
      .config(ctx => {
        ctx.set(rootCtx, container);
        if (this.value) {
          ctx.set(defaultValueCtx, this.value);
        }

        const listenerManager = ctx.get(listenerCtx);
        listenerManager.markdownUpdated((_, markdown) => {
          if (this.internalUpdate) {
            return;
          }

          this.zone.run(() => {
            this.value = markdown;
            this.onChange(markdown);
            this.onTouched();
          });
        });

        listenerManager.focus(() =>
          this.zone.run(() => {
            this.focused = true;
            this.cdr.markForCheck();
          }),
        );

        listenerManager.blur(() =>
          this.zone.run(() => {
            this.focused = false;
            this.onTouched();
            this.cdr.markForCheck();
          }),
        );
      })
      .use(listener)
      .use(commonmark)
      .use(gfm)
      .use(history)
      .use(superscriptAttr)
      .use(superscriptSchema)
      .use(toggleSuperscriptCommand)
      .use(superscriptInputRule)
      .use(remarkSuperscriptMergePlugin.plugin)
      .use(remarkSuperscriptMergePlugin.options)
      .use(this.createActiveMarksPlugin())
      .create();

    if (this.value) {
      this.internalUpdate = true;
      this.editor.action(replaceAll(this.value));
      this.internalUpdate = false;
    }

    this.updateEditorEditable();
  }

  private updateEditorEditable(): void {
    this.editor?.action(ctx => {
      const view = ctx.get(editorViewCtx);
      view.setProps({
        editable: () => !this.readonly,
      });
    });
  }

  private createActiveMarksPlugin() {
    return $prose(() => {
      return new Plugin({
        key: new PluginKey('active-marks-tracker'),
        view: () => ({
          update: view => this.updateActiveMarks(view),
        }),
      });
    });
  }

  private updateActiveMarks(view: any): void {
    const { from, $from, to, empty } = view.state.selection;
    const fallbackMarks = $from.marks();
    const strongType = view.state.schema.marks['strong'];
    const emphasisType = view.state.schema.marks['emphasis'];
    const strikethroughType = view.state.schema.marks['strike_through'];
    const superscriptType = view.state.schema.marks[superscriptName];
    const isActive = this.getMarkActivityChecker(view, from, to, empty, fallbackMarks);

    this.zone.run(() => {
      this.boldActive = this.resolveMarkState(strongType, isActive);
      this.italicActive = this.resolveMarkState(emphasisType, isActive);
      this.strikethroughActive = this.resolveMarkState(strikethroughType, isActive);
      this.superscriptActive = this.resolveMarkState(superscriptType, isActive);

      this.cdr.markForCheck();
    });
  }

  private getMarkActivityChecker(
    view: any,
    from: number,
    to: number,
    empty: boolean,
    fallbackMarks: readonly any[],
  ): (markType: MarkType) => boolean {
    if (empty) {
      return markType => this.isStoredMarkActive(view, markType, fallbackMarks);
    }

    return markType => this.isRangeMarkActive(view, markType, from, to);
  }

  private resolveMarkState(markType: MarkType | undefined, isActive: (markType: MarkType) => boolean): boolean {
    return !!markType && isActive(markType);
  }

  private isStoredMarkActive(view: any, markType: MarkType, fallbackMarks: readonly any[]): boolean {
    return !!markType.isInSet(view.state.storedMarks ?? fallbackMarks);
  }

  private isRangeMarkActive(view: any, markType: MarkType, from: number, to: number): boolean {
    return view.state.doc.rangeHasMark(from, to, markType);
  }

  private getEditor(): HTMLElement | null {
    return this.editorContainer.nativeElement.querySelector<HTMLElement>('.ProseMirror');
  }

  private callCommand(ctx: Ctx, commandKey: CmdKey<any>): void {
    const cmds = ctx.get(commandsCtx);
    cmds.call(commandKey);
  }

  private updateErrorMessages(): void {
    if (!this.showDefaultErrors || !this.error || !this.ngControl?.errors) {
      this.errorMessages = [];
      return;
    }

    const messages: string[] = [];
    const errors = this.ngControl.errors;

    for (const key of Object.keys(errors)) {
      const errorValue = errors[key];
      const params = this.resolveValidationParams(key, errorValue);

      const message = this.validationMessagesIntl.getMessage(key, params);
      if (message) {
        messages.push(message);
      }
    }

    this.errorMessages = messages;
  }

  private resolveValidationParams(key: string, errorValue: any): { [key: string]: any } | undefined {
    switch (key) {
      case 'minlength':
      case 'maxlength':
        return { requiredLength: errorValue.requiredLength };
      case 'min':
        return { min: errorValue.min };
      case 'max':
        return { max: errorValue.max };
      default:
        return typeof errorValue === 'object' && errorValue !== null && errorValue !== true ? errorValue : undefined;
    }
  }
}
