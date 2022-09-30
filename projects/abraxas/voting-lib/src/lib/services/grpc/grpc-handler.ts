/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { ClientReadableStream, Metadata, RpcError } from 'grpc-web';
import { Observable } from 'rxjs';
import { GrpcInterceptor } from './grpc-interceptor';

export type GrpcRequestFn<TReq, TResp> = (request: TReq, metadata?: Metadata) => Observable<TResp>;
export type GrpcUnaryRequestFn<TReq, TResp> = (request: TReq, metadata?: Metadata) => Promise<TResp>;
export type GrpcServerStreamingRequestFn<TReq, TResp> = (request: TReq, metadata?: Metadata) => ClientReadableStream<TResp>;

export type GrpcClientStreamingRequestFn<TReq, TResp> = (
  request: TReq,
  metadata: Metadata | undefined,
  callback: (err: RpcError, response: TResp) => void,
) => ClientReadableStream<TResp>;

export interface GrpcHandler {
  handle(req: unknown, metadata: Metadata): Observable<any>;
}

export class GrpcInterceptorHandler implements GrpcHandler {
  constructor(private readonly next: GrpcHandler, private interceptor: GrpcInterceptor) {}

  public handle(req: unknown, metadata: Metadata): Observable<any> {
    return this.interceptor.intercept(req, metadata, this.next);
  }
}

export class GrpcDefaultHandler<TReq, TResp> implements GrpcHandler {
  constructor(private readonly requestFn: GrpcRequestFn<TReq, TResp>) {}

  public handle(req: TReq, metadata: Metadata): Observable<any> {
    return this.requestFn(req, metadata);
  }
}
