/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

const defaultTransitionTime = '0.15s';
const defaultSidebarWidth = '20rem';

@Component({
  selector: 'vo-lib-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('openClose', [
      transition(':enter', [animate(defaultTransitionTime)]),
      transition(':leave', [animate(defaultTransitionTime)]),
      transition('open <=> close', animate(defaultTransitionTime)),
      state('open', style({ width: '{{width}}' }), { params: { width: defaultSidebarWidth } }),
      state('close', style({ width: '0' })),
    ]),
  ],
})
export class SidebarComponent {
  @Input()
  public sidebarWidth: string = defaultSidebarWidth;

  @Input()
  public sidebarTemplate?: TemplateRef<any>;

  @Output()
  public openChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  private openValue: boolean = false;

  @Input()
  public get open(): boolean {
    return this.openValue;
  }

  public set open(v: boolean) {
    this.openValue = v;
    this.openChange.emit(this.openValue);
  }
}
