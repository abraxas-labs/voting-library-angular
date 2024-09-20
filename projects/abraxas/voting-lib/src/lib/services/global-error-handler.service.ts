/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { RpcError } from 'grpc-web';
import { ErrorToastUtil } from './error-toast.util';
import { HttpProblemDetails } from './http/http-problem-details.model';

const ERROR_TYPE_SEPARATOR = ':';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private readonly errorToast: ErrorToastUtil,
    private readonly zone: NgZone,
  ) {}

  public handleError(error: any): void {
    if (error.promise && error.rejection) {
      // Promise rejection wrapped by zone.js
      error = error.rejection;
    }

    if (error instanceof RpcError) {
      this.zone.run(() => this.handleGrpcError(error));
      return;
    }

    if (error instanceof HttpErrorResponse) {
      this.zone.run(() => this.handleHttpError(error));
      return;
    }

    // we don't want to display an error dialog for client-side errors, since that could be annoying
    console.error('Unhandled error', error);
  }

  public handleGrpcError(err: RpcError): void {
    console.error(err);

    const code = err?.code;
    const errorType = err?.message?.split(ERROR_TYPE_SEPARATOR)[0];

    this.errorToast.toastError(code, errorType);
  }

  public handleHttpError(err: HttpErrorResponse): void {
    console.error(err);

    const code = err.status;

    // to read error details from blob
    // copy paste from https://github.com/angular/angular/issues/19888#issuecomment-522119151
    if (err.error instanceof Blob && err.error.type === 'application/json') {
      const reader = new FileReader();

      reader.onload = (e: Event) => {
        const problemDetails = JSON.parse((e.target as any).result) as HttpProblemDetails;
        this.errorToast.toastError(code, problemDetails?.title);
      };

      reader.onerror = e => {};

      reader.readAsText(err.error);
      return;
    }

    const problem = err?.error as HttpProblemDetails;
    const errorType = problem?.title;

    this.errorToast.toastError(code, errorType);
  }
}
