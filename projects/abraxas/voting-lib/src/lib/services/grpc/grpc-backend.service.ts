/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { Inject, Injectable } from '@angular/core';
import { ClientReadableStream, Metadata } from 'grpc-web';
import { firstValueFrom, from, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import {
  GrpcClientStreamingRequestFn,
  GrpcDefaultHandler,
  GrpcHandler,
  GrpcInterceptorHandler,
  GrpcRequestFn,
  GrpcServerStreamingRequestFn,
  GrpcUnaryRequestFn,
} from './grpc-handler';
import { GRPC_INTERCEPTORS, GrpcInterceptor } from './grpc-interceptor';

@Injectable({
  providedIn: 'root',
})
export class GrpcBackendService {
  constructor(@Inject(GRPC_INTERCEPTORS) private readonly interceptors: GrpcInterceptor[]) {}

  public runRequest<TReq, TResp>(requestFn: GrpcUnaryRequestFn<TReq, TResp>, request: TReq, metadata: Metadata = {}): Promise<TResp> {
    const wrappedFn = this.wrapUnaryRequestFn(requestFn);
    return firstValueFrom(this.buildChain(wrappedFn).handle(request, metadata));
  }

  public runServerStreamingRequest<TReq, TResp>(
    requestFn: GrpcServerStreamingRequestFn<TReq, TResp>,
    request: TReq,
    metadata: Metadata = {},
  ): Observable<TResp> {
    const wrappedFn = this.wrapServerStreamingRequestFn(requestFn);
    return this.buildChain(wrappedFn).handle(request, metadata);
  }

  public runClientStreamingRequest<TReq, TResp>(
    requestFn: GrpcClientStreamingRequestFn<TReq, TResp>,
    request: TReq,
    metadata: Metadata = {},
  ): Observable<TResp> {
    const wrappedFn = this.wrapClientStreamingRequestFn(requestFn);
    return this.buildChain(wrappedFn).handle(request, metadata);
  }

  private wrapUnaryRequestFn<TReq, TResp>(requestFn: GrpcUnaryRequestFn<TReq, TResp>): GrpcRequestFn<TReq, TResp> {
    return (req, meta) => from(requestFn(req, meta));
  }

  private wrapServerStreamingRequestFn<TReq, TResp>(requestFn: GrpcServerStreamingRequestFn<TReq, TResp>): GrpcRequestFn<TReq, TResp> {
    return (req, meta) => {
      return new Observable(ob => {
        const stream = requestFn(req, meta);

        stream.on('data', x => ob.next(x));

        stream.on('error', x => {
          ob.error(x);
          ob.complete();
        });

        stream.on('end', () => ob.complete());

        return () => stream.cancel();
      });
    };
  }

  private wrapClientStreamingRequestFn<TReq, TResp>(requestFn: GrpcClientStreamingRequestFn<TReq, TResp>): GrpcRequestFn<TReq, TResp> {
    let status: ClientReadableStream<TResp>;
    let completed = false;
    return (req, meta) =>
      from(
        new Promise<TResp>((resolve, reject) => {
          status = requestFn(req, meta, (err, resp) => {
            if (!!err) {
              reject(err);
              return;
            }

            completed = true;
            resolve(resp);
          });
        }),
      ).pipe(
        finalize(() => {
          if (!completed) {
            status.cancel();
          }
        }),
      );
  }

  private buildChain<TReq, TResp>(requestFn: GrpcRequestFn<TReq, TResp>): GrpcHandler {
    const defaultHandler: GrpcHandler = new GrpcDefaultHandler(requestFn);
    return this.interceptors.reduceRight((next, interceptor) => new GrpcInterceptorHandler(next, interceptor), defaultHandler);
  }
}
