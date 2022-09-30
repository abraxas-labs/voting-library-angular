/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EnumItem } from '../models/enum-item';
import { EnumItemDescription } from '../models/enum-item-description';

@Injectable({
  providedIn: 'root',
})
export class EnumUtil {
  constructor(private readonly i18n: TranslateService) {}

  public static getArray<T>(enumObj: object | undefined): EnumItem<T>[] {
    const items = EnumUtil.getArrayWithUnspecified<T>(enumObj);
    return items.filter(i => (i.value as any) !== 0);
  }

  public static getArrayWithUnspecified<T>(enumObj: object | undefined): EnumItem<T>[] {
    if (!enumObj) {
      return [];
    }

    return Object.entries(enumObj).map(([key, value]) => ({
      key,
      value,
    }));
  }

  public getArrayWithDescriptions<T>(enumObj: object | undefined, i18nPrefix: string): EnumItemDescription<T>[] {
    const items = this.getArrayWithDescriptionsWithUnspecified<T>(enumObj, i18nPrefix);
    return items.filter(i => (i.value as any) !== 0);
  }

  public getArrayWithDescriptionsWithUnspecified<T>(enumObj: object | undefined, i18nPrefix: string): EnumItemDescription<T>[] {
    if (!enumObj) {
      return [];
    }

    return Object.values(enumObj).map(value => ({
      value,
      description: this.i18n.instant(i18nPrefix + value),
    }));
  }
}
