/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { TreeNode } from './tree-node';

@Component({
  selector: 'vo-lib-tree-navigation',
  templateUrl: './tree-navigation.component.html',
  styleUrls: ['./tree-navigation.component.scss'],
})
export class TreeNavigationComponent<T> {
  @Input()
  public editModeEnabled: boolean = false;

  @Input()
  public nodes: TreeNode<T>[] = [];

  @Input()
  public depth: number = 0;

  @Input()
  public rowTemplate?: TemplateRef<TreeNode<T>>;

  @Output()
  public selectedNodeChange: EventEmitter<TreeNode<T>> = new EventEmitter<TreeNode<T>>();

  @Output()
  public nodeEdit: EventEmitter<TreeNode<T>> = new EventEmitter<TreeNode<T>>();

  @Output()
  public nodeInfo: EventEmitter<TreeNode<T>> = new EventEmitter<TreeNode<T>>();

  @Output()
  public nodeDelete: EventEmitter<TreeNode<T>> = new EventEmitter<TreeNode<T>>();

  private selectedNodeValue: TreeNode<T> | undefined = undefined;

  @Input()
  public get selectedNode(): TreeNode<T> | undefined {
    return this.selectedNodeValue;
  }

  public set selectedNode(node: TreeNode<T> | undefined) {
    if (this.selectedNodeValue === node) {
      return;
    }
    this.selectedNodeValue = node;
    this.selectedNodeChange.emit(node);
  }

  public get padding(): string {
    return `${this.depth}rem`;
  }

  public caretIcon(node: TreeNode<T>): string {
    return node.open ? 'caret-down' : 'caret-right';
  }

  public toggleOpen(node: TreeNode<T>): void {
    node.open = !node.open;
  }

  public toggleSelectedNode(node: TreeNode<T>): void {
    this.selectedNode = this.selectedNode !== node ? node : undefined;
    node.open = true;
  }
}
