/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { $command, $inputRule, $markAttr, $markSchema, $remark } from '@milkdown/kit/utils';
import { toggleMark } from '@milkdown/kit/prose/commands';
import { InputRule } from '@milkdown/kit/prose/inputrules';

export const superscriptName = 'superscript';

export const remarkSuperscriptMergePlugin = $remark('remarkSuperscriptMerge', () => () => (tree: any) => {
  mergeSuperscriptNodes(tree);
});

function mergeSuperscriptNodes(node: any): void {
  if (!node.children) {
    return;
  }

  const merged: any[] = [];
  for (let index = 0; index < node.children.length; ) {
    const superscriptMatch = parseSuperscriptAt(node.children, index);
    if (superscriptMatch) {
      merged.push(createSuperscriptNode(superscriptMatch.textParts));
      index = superscriptMatch.nextIndex;
      continue;
    }

    const child = node.children[index];
    mergeSuperscriptNodes(child);
    merged.push(child);
    index++;
  }

  node.children = merged;
}

function parseSuperscriptAt(children: any[], startIndex: number): { textParts: string[]; nextIndex: number } | null {
  const startNode = children[startIndex];
  if (startNode?.type !== 'html' || startNode.value !== '<sup>') {
    return null;
  }

  const textParts: string[] = [];
  let index = startIndex + 1;
  while (index < children.length && children[index]?.type === 'text') {
    textParts.push(children[index].value);
    index++;
  }

  const endNode = children[index];
  if (!textParts.length || endNode?.type !== 'html' || endNode.value !== '</sup>') {
    return null;
  }

  return { textParts, nextIndex: index + 1 };
}

function createSuperscriptNode(textParts: string[]): any {
  return {
    type: 'superscript',
    children: textParts.map(value => ({ type: 'text', value })),
  };
}

export const superscriptAttr = $markAttr(superscriptName);

export const superscriptSchema = $markSchema(superscriptName, () => ({
  parseDOM: [{ tag: 'sup' }],
  toDOM: () => ['sup', 0],
  parseMarkdown: {
    match: (node: any) => node.type === 'superscript',
    runner: (state: any, node: any, markType: any) => {
      state.openMark(markType);
      state.next(node.children);
      state.closeMark(markType);
    },
  },
  toMarkdown: {
    match: (mark: any) => mark.type.name === superscriptName,
    runner: (state: any, _: any, node: any) => {
      state.addNode('html', undefined, `<sup>${node.text ?? ''}</sup>`);
      return true;
    },
  },
}));

export const toggleSuperscriptCommand = $command('ToggleSuperscript', ctx => () => toggleMark(superscriptSchema.type(ctx)));

export const superscriptInputRule = $inputRule(
  ctx =>
    new InputRule(/\^([^^]+)\^$/, (state, match, start, end) => {
      const markType = superscriptSchema.type(ctx);
      const content = match[1];
      if (!content) return null;
      return state.tr.replaceWith(start, end, state.schema.text(content, [markType.create()]));
    }),
);
