/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SEARCH_DEBOUNCE_TIME } from '../../../tokens';
import { TreeNode } from '../tree-node';

@Component({
  selector: 'vo-lib-searchable-tree-navigation',
  templateUrl: './searchable-tree-navigation.component.html',
  styleUrls: ['./searchable-tree-navigation.component.scss'],
})
export class SearchableTreeNavigationComponent<T> implements OnInit, OnDestroy {
  @Input()
  public editModeEnabled: boolean = false;

  @Input()
  public addLabel: string = 'COMMON.ADD';

  @Input()
  public showAdd: boolean = false;

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

  @Output()
  public addClicked: EventEmitter<void> = new EventEmitter<void>();

  public filteredNodes: TreeNode<T>[] = [];
  private nodesValue: TreeNode<T>[] = [];

  private searchTextValue: string | undefined;
  private readonly search$: Subject<string> = new Subject<string>();
  private searchSubscription?: Subscription;

  constructor(@Inject(SEARCH_DEBOUNCE_TIME) private readonly searchDebounceTime: number) {}

  @Input()
  public set nodes(v: TreeNode<T>[]) {
    this.nodesValue = v;
    this.updateFilteredNodes();
  }

  public get searchText(): string | undefined {
    return this.searchTextValue;
  }

  public set searchText(v: string | undefined) {
    if (v === this.searchTextValue || v === undefined) {
      return;
    }

    this.searchTextValue = v;
    this.search$.next(v);
  }

  public ngOnInit(): void {
    this.searchSubscription = this.search$
      .pipe(debounceTime(this.searchDebounceTime), distinctUntilChanged())
      .subscribe(() => this.updateFilteredNodes());
  }

  public ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  private updateFilteredNodes(): void {
    const upperSearchText = this.searchTextValue?.toUpperCase() || '';
    this.filteredNodes = this.nodesValue.filter(n => n.filter(upperSearchText));
    const open = this.filteredNodes.length === 1 && this.filteredNodes[0].countLeafs() <= 3;
    for (const x of this.filteredNodes) {
      x.setAllOpen(open);
    }
  }
}
