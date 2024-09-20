/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import { Metadata } from 'grpc-web';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GrpcBackendService } from './grpc-backend.service';
import { GrpcEnvironment } from './grpc-environment';
import { GrpcClientStreamingRequestFn } from './grpc-handler';
import { GrpcService, ResponseMapper } from './grpc.service';

type ClientStreamingRequestFactory<TStreamingClient, TReq, TResp> = (client: TStreamingClient) => GrpcClientStreamingRequestFn<TReq, TResp>;

export abstract class GrpcStreamingService<TClient, TStreamingClient> extends GrpcService<TClient> {
  private readonly streamingClient: TStreamingClient;

  protected constructor(
    clientFactory: new (endpoint: string) => TClient,
    streamingClientFactory: new (endpoint: string) => TStreamingClient,
    environment: GrpcEnvironment,
    protected readonly grpc: GrpcBackendService,
  ) {
    super(clientFactory, environment, grpc);
    this.streamingClient = new streamingClientFactory(environment.grpcApiEndpoint);

    if (!environment.production) {
      GrpcService.enableDevTools([this.streamingClient]);
    }
  }

  protected requestClientStream<TReq, TResp, TMappedResp>(
    requestFn: ClientStreamingRequestFactory<TStreamingClient, TReq, TResp>,
    request: TReq,
    responseMapper: ResponseMapper<TResp, TMappedResp>,
    metadata?: Metadata,
  ): Observable<TMappedResp> {
    const mappedRequestFn = requestFn(this.streamingClient).bind(this.streamingClient);
    const resp = this.grpc.runClientStreamingRequest(mappedRequestFn, request, metadata);
    return resp.pipe(map(x => responseMapper(x)));
  }

  protected requestClientStreamEmptyResp<TReq>(
    requestFn: ClientStreamingRequestFactory<TStreamingClient, TReq, Empty>,
    request: TReq,
    metadata?: Metadata,
  ): Observable<void> {
    return this.requestClientStream(requestFn, request, () => undefined, metadata);
  }
}
