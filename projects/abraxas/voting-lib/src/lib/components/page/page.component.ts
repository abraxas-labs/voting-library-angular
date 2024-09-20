/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'vo-lib-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent {
  @Input()
  public contentLoading: boolean = true;

  @Input()
  public showBackButton: boolean = false;

  @Input()
  public backButtonNavigateCommands: any[] = [];

  @Input()
  public enableSidebar: boolean = false;

  @Input()
  public header: string = '';

  @Input()
  public sidebarWidth: string = '20rem';

  @Input()
  public sidebarTemplate?: TemplateRef<any>;

  @Output()
  public sidebarOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  private sidebarOpenValue: boolean = false;

  @Input()
  public get sidebarOpen(): boolean {
    return this.sidebarOpenValue;
  }

  public set sidebarOpen(v: boolean) {
    this.sidebarOpenValue = v;
    this.sidebarOpenChange.emit(this.sidebarOpenValue);
  }
}
