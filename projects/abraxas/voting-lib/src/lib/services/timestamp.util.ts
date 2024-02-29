/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';

export class TimestampUtil {
  public static toTimestamp(date: Date | undefined): Timestamp | undefined {
    if (!date) {
      return undefined;
    }

    const timestamp = new Timestamp();
    timestamp.fromDate(date);
    return timestamp;
  }
}
