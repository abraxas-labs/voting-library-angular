/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { TreeNode } from './tree-node';

export abstract class Tree<T> {
  public nodes: TreeNode<T>[];

  protected constructor(data?: T[]) {
    this.nodes = this.buildTree(data);
  }

  public addChildNode(data: T, parentNode?: TreeNode<T>): void {
    const newNode = this.buildTreeSingle(data);
    if (!parentNode) {
      this.nodes = [...this.nodes, newNode];
      return;
    }

    parentNode.addChildNode(newNode);
    parentNode.open = true;
  }

  public updateNode(updated: T): void {
    for (const item of this.nodes) {
      const node = item.findFirstNode(x => this.areEqual(x, updated));
      if (node != null) {
        node.data = Object.assign(node.data, updated);
        node.displayName = this.buildDisplayName(updated);
        return;
      }
    }
  }

  public remove(node: TreeNode<T>): void {
    if (!node.removeFromParent()) {
      this.nodes = this.nodes.filter(n => n !== node);
    }
  }

  protected abstract buildDisplayName(data: T): string;

  protected abstract areEqual(left: T, right: T): boolean;

  protected abstract getChildren(node: T): T[] | undefined;

  private buildTree(data?: T[]): TreeNode<T>[] {
    if (!data) {
      return [];
    }

    return data.map(d => this.buildTreeSingle(d));
  }

  private buildTreeSingle(data: T): TreeNode<T> {
    const newNode = new TreeNode<T>(data, this.buildDisplayName(data));

    for (const item of this.buildTree(this.getChildren(data))) {
      newNode.addChildNode(item);
    }

    return newNode;
  }
}
