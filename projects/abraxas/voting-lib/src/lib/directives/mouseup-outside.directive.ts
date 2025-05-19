/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[voLibMouseupOutside]',
  standalone: false,
})
// Copied from base components, since the directive is not exported
// https://gitlab.abraxas-tools.ch/abraxas/customapps/libraries/angular/base-components-next/-/blob/master/projects/
// abraxas/base-components/src/lib/directives/mouseup-outside
export class MouseupOutsideDirective {
  @Output()
  public voLibMouseupOutside: EventEmitter<MouseEvent> = new EventEmitter();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:pointerup', ['$event'])
  public mousemove(event: PointerEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.voLibMouseupOutside.emit(event);
    }
  }
}
