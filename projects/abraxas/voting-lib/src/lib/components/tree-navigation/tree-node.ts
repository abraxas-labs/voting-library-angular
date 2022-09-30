/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

export class TreeNode<T> {
  public open?: boolean;
  public parentNode?: TreeNode<T>;

  public showInfoButton: boolean = false;
  public showEditButton: boolean = true;
  public showDeleteButton: boolean = true;

  private childNodes: TreeNode<T>[] = [];
  private filteredChildNodesValue: TreeNode<T>[] = [];

  constructor(public data: T, public displayName: string) {}

  public get filteredChildNodes(): TreeNode<T>[] {
    return this.filteredChildNodesValue;
  }

  public addChildNode(node: TreeNode<T>): void {
    node.parentNode = this;

    this.childNodes = [...this.childNodes, node];
    this.filteredChildNodesValue = [...this.filteredChildNodesValue, node];
  }

  public removeFromParent(): boolean {
    if (!this.parentNode) {
      return false;
    }

    this.parentNode.childNodes = this.parentNode.childNodes.filter(c => c !== this);
    this.parentNode.filteredChildNodesValue = this.parentNode.filteredChildNodesValue.filter(c => c !== this);
    return true;
  }

  public filter(upperSearchValue?: string): boolean {
    this.filteredChildNodesValue = this.childNodes.filter(cn => cn.filter(upperSearchValue));
    return !upperSearchValue || this.displayName.toUpperCase().includes(upperSearchValue) || this.filteredChildNodesValue.length > 0;
  }

  public countLeafs(): number {
    if (this.filteredChildNodesValue.length === 0) {
      return 1;
    }

    return this.filteredChildNodesValue.map(x => x.countLeafs()).reduce((x, y) => x + y, 0);
  }

  public setAllOpen(open: boolean): void {
    this.open = open;
    for (const c of this.filteredChildNodesValue) {
      c.setAllOpen(open);
    }
  }

  public findFirstNode(filter: (item: T) => boolean): TreeNode<T> | undefined {
    if (filter(this.data)) {
      return this;
    }

    for (const childNode of this.childNodes) {
      const item = childNode.findFirstNode(filter);
      if (item) {
        return item;
      }
    }
  }
}
