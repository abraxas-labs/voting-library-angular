/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

export enum SecondFactorTransactionProvider {
  UNSPECIFIED = 0,
  NEVIS = 1,
  OTP = 2,
}

export interface SecondFactorTransactionNevisInfo {
  correlationCode: string;
  qrCode: string;
}
