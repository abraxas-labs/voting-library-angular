import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'vo-lib-split-screen',
  templateUrl: './split-screen.component.html',
  styleUrls: ['./split-screen.component.scss'],
})
export class SplitScreenComponent implements AfterViewInit {
  @Input() public orientation: 'vertical' | 'horizontal' = 'horizontal';

  @Input()
  public set position(value: number) {
    this._position = value;
    this.setPositions();
  }
  public get position(): number {
    return this._position;
  }

  public firstPercentage: string = '50%';
  public secondPercentage: string = '50%';
  public dividerPos: string = '49.1%';
  public _position: number = 0.5;
  private isResizing: boolean = false;

  @ViewChild('container', { static: true })
  private container!: ElementRef<HTMLDivElement>;
  @ViewChild('divider', { static: true })
  private divider!: ElementRef<HTMLDivElement>;

  public ngAfterViewInit(): void {
    this.setPositions();
  }

  public mousedown(): void {
    this.isResizing = true;
  }

  public mousemove(event: MouseEvent): void {
    if (!this.isResizing) {
      return;
    }

    let newPosition = 0;
    const rect = this.container.nativeElement.getBoundingClientRect();
    if (this.orientation === 'horizontal') {
      newPosition = (1 / rect.width) * (event.clientX - rect.left);
    } else if (this.orientation === 'vertical') {
      newPosition = (1 / rect.height) * (event.clientY - rect.top);
    }

    this._position = Math.min(Math.max(newPosition, 0), 1);
    this.setPositions();
  }

  public mouseup(): void {
    this.isResizing = false;
  }

  private setPositions(): void {
    const containerEl = this.container.nativeElement;
    const dividerEl = this.divider.nativeElement;
    let containerDimension;
    let dividerDimension;
    if (this.orientation === 'horizontal') {
      containerDimension = containerEl.clientWidth;
      dividerDimension = dividerEl.clientWidth;
    } else {
      containerDimension = containerEl.clientHeight;
      dividerDimension = dividerEl.clientHeight;
    }

    const firstDimension = containerDimension * this._position;
    const secondDimension = containerDimension * (1 - this._position);
    const dividerPos = containerDimension * this._position - dividerDimension / 2;

    this.firstPercentage = this.getPercentage(firstDimension, containerDimension);
    this.secondPercentage = this.getPercentage(secondDimension, containerDimension);
    this.dividerPos = this.getPercentage(dividerPos, containerDimension);
  }

  private getPercentage(a: number, b: number): string {
    return `${(a / b) * 100}%`;
  }
}
