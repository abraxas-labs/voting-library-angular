/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import { Metadata } from 'grpc-web';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GrpcBackendService } from './grpc-backend.service';
import { GrpcEnvironment } from './grpc-environment';
import { GrpcServerStreamingRequestFn, GrpcUnaryRequestFn } from './grpc-handler';

type UnaryRequestFactory<TClient, TReq, TResp> = (client: TClient) => GrpcUnaryRequestFn<TReq, TResp>;
type ServerStreamingRequestFactory<TClient, TReq, TResp> = (client: TClient) => GrpcServerStreamingRequestFn<TReq, TResp>;

export type ResponseMapper<TResp, TMappedResp> = (resp: TResp) => TMappedResp;

export abstract class GrpcService<TClient> {
  protected static readonly enableDevTools: (clients: any[]) => void = (window as any).__GRPCWEB_DEVTOOLS__ || (() => {});

  private readonly client: TClient;

  protected constructor(
    clientFactory: new (endpoint: string) => TClient,
    environment: GrpcEnvironment,
    protected readonly grpc: GrpcBackendService,
  ) {
    this.client = new clientFactory(environment.grpcApiEndpoint);

    if (!environment.production) {
      GrpcService.enableDevTools([this.client]);
    }
  }

  protected async requestEmpty(requestFn: UnaryRequestFactory<TClient, Empty, Empty>, metadata?: Metadata): Promise<void> {
    return this.request(requestFn, new Empty(), () => undefined, metadata);
  }

  protected async requestEmptyResp<TReq>(
    requestFn: UnaryRequestFactory<TClient, TReq, Empty>,
    request: TReq,
    metadata?: Metadata,
  ): Promise<void> {
    return this.request(requestFn, request, () => undefined, metadata);
  }

  protected async requestEmptyReq<TResp, TMappedResp>(
    requestFn: UnaryRequestFactory<TClient, Empty, TResp>,
    responseMapper: ResponseMapper<TResp, TMappedResp>,
    metadata?: Metadata,
  ): Promise<TMappedResp> {
    return this.request(requestFn, new Empty(), responseMapper, metadata);
  }

  protected async request<TReq, TResp, TMappedResp>(
    requestFn: UnaryRequestFactory<TClient, TReq, TResp>,
    request: TReq,
    responseMapper: ResponseMapper<TResp, TMappedResp>,
    metadata?: Metadata,
  ): Promise<TMappedResp> {
    const mappedRequestFn = requestFn(this.client).bind(this.client);
    const response: TResp = await this.grpc.runRequest(mappedRequestFn, request, metadata);
    return responseMapper(response);
  }

  protected requestServerStream<TReq, TResp, TMappedResp>(
    requestFn: ServerStreamingRequestFactory<TClient, TReq, TResp>,
    request: TReq,
    responseMapper: ResponseMapper<TResp, TMappedResp>,
    metadata?: Metadata,
  ): Observable<TMappedResp> {
    const mappedRequestFn = requestFn(this.client).bind(this.client);
    const resp = this.grpc.runServerStreamingRequest(mappedRequestFn, request, metadata);
    return resp.pipe(map(x => responseMapper(x)));
  }
}
