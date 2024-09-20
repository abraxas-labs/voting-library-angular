/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

export class NumberUtil {
  public static getEmptyStringIfZero(value: number): string {
    return value === 0 ? '' : value.toString();
  }

  public static getNumberFromString(value: string): number {
    const n = parseInt(value, 10);
    return NumberUtil.getNumberOrZero(n);
  }

  public static getNumberOrZero(x: number | undefined): number {
    return !x || Number.isNaN(x) ? 0 : +x;
  }
}
