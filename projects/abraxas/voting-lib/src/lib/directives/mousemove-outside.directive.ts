/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[voLibMousemoveOutside]',
  standalone: false,
})
// Copied from base components, since the directive is not exported
// https://gitlab.abraxas-tools.ch/abraxas/customapps/libraries/angular/base-components/-/blob/master/projects/
// abraxas/base-components/src/lib/directives/mousemove-outside
export class MousemoveOutsideDirective {
  @Output()
  public voLibMousemoveOutside: EventEmitter<MouseEvent> = new EventEmitter();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:pointermove', ['$event'])
  public mousemove(event: PointerEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.voLibMousemoveOutside.emit(event);
    }
  }
}
