/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { GrpcError } from '../../models/grpc-error.model';

export const ERROR_TYPE_SEPARATOR = ':';

export const GRPC_NOT_FOUND_STATUS_CODE = 5;

export const GRPC_PERMISSION_DENIED_CODE = 7;

export function isErrorType(error: unknown, type: string): boolean {
  if (!isGrpcError(error)) {
    return false;
  }

  return error.message.startsWith(type + ERROR_TYPE_SEPARATOR);
}

export function isErrorCode(error: unknown, code: number): boolean {
  if (!isGrpcError(error)) {
    return false;
  }

  return error.code === code;
}

export function isGrpcError(err: unknown): err is GrpcError {
  const grpcErr = err as GrpcError;
  return grpcErr !== undefined && typeof grpcErr.code === 'number' && typeof grpcErr.message === 'string';
}
