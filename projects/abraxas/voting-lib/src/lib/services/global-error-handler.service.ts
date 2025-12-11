/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, NgZone, inject } from '@angular/core';
import { RpcError } from 'grpc-web';
import { HttpProblemDetails } from './http/http-problem-details.model';
import { ERROR_STATUS_CODE_URL_MAPPING, GRPC_ERROR_MAPPER, NOT_FOUND_ERROR_URL, PERMISSION_DENIED_ERROR_URL } from '../tokens';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';

const ERROR_TYPE_SEPARATOR = ':';

const HTTP_NOT_FOUND_STATUS_CODE = 404;
const GRPC_NOT_FOUND_STATUS_CODE = 5;

const HTTP_PERMISSION_DENIED_CODE = 403;
const GRPC_PERMISSION_DENIED_CODE = 7;

export type GrpcErrorMapper = (error: any) => undefined | { code: number; message: string };

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
  private readonly i18n = inject(TranslateService);
  private readonly zone = inject(NgZone);
  private readonly router = inject(Router);
  private readonly snackbarService = inject(SnackbarService);
  private readonly grpcErrorMapper = inject<GrpcErrorMapper>(GRPC_ERROR_MAPPER, { optional: true });
  private readonly notFoundUrl = inject(NOT_FOUND_ERROR_URL, { optional: true });
  private readonly permissionDeniedUrl = inject(PERMISSION_DENIED_ERROR_URL, { optional: true });
  private statusCodeUrlMapping = inject<Record<number, string>>(ERROR_STATUS_CODE_URL_MAPPING, { optional: true });

  constructor() {
    this.setupStatusUrlMappings();
  }

  public handleError(error: any): void {
    if (error.promise && error.rejection) {
      // Promise rejection wrapped by zone.js
      error = error.rejection;
    }

    if (this.tryHandleError(error)) {
      console.error('handled error', error);
      return;
    }

    // we don't want to display an error dialog for client-side errors, since that could be annoying
    console.error('Unhandled error', error);
  }

  protected tryHandleError(error: any): boolean {
    if (this.grpcErrorMapper) {
      const mapped = this.grpcErrorMapper(error);
      if (mapped) {
        this.zone.run(() => this.handleGrpcError(mapped));
        return true;
      }
    }

    if (error instanceof RpcError) {
      this.zone.run(() => this.handleGrpcError(error));
      return true;
    }

    if (error instanceof HttpErrorResponse) {
      this.zone.run(() => this.handleHttpError(error));
      return true;
    }

    return false;
  }

  protected errorHandled(code: number, errorType: string): void {
    if (code in this.statusCodeUrlMapping!) {
      // do not update url in the browser address bar, just render it within angular
      this.router.navigateByUrl(this.statusCodeUrlMapping![code], { skipLocationChange: true });
      return;
    }

    this.showError(this.buildErrorMessage(code, errorType));
  }

  protected showError({ title, message }: { title: string; message: string }): void {
    this.snackbarService.error(`${title}: ${message}`);
  }

  protected buildErrorMessage(code: number, errorType: string): { title: string; message: string } {
    const params = { detail: `Code: ${code ?? ''}`, code, errorType };
    const title = this.tryTranslationKeys(params, `ERRORS.${errorType}.TITLE`, `ERRORS.${code}.TITLE`, 'ERRORS.GENERIC.TITLE');

    const message = this.tryTranslationKeys(
      params,
      `ERRORS.${errorType}.MESSAGE`,
      `ERROR_MESSAGES.${errorType}`, // legacy messages
      `ERRORS.${code}.MESSAGE`,
      'ERRORS.GENERIC.TITLE',
    );
    return { title, message };
  }

  protected handleGrpcError(err: { code: number; message: string }): void {
    const code = err?.code;
    const errorType = err?.message?.split(ERROR_TYPE_SEPARATOR)[0];
    this.errorHandled(code, errorType);
  }

  protected handleHttpError(err: HttpErrorResponse): void {
    const code = err.status;

    // to read error details from blob
    // copy paste from https://github.com/angular/angular/issues/19888#issuecomment-522119151
    if (err.error instanceof Blob && err.error.type === 'application/json') {
      const reader = new FileReader();

      reader.onload = (e: Event) => {
        const problemDetails = JSON.parse((e.target as any).result) as HttpProblemDetails;
        this.errorHandled(code, problemDetails?.title);
      };

      reader.onerror = () => {};

      reader.readAsText(err.error);
      return;
    }

    const problem = err?.error as HttpProblemDetails;
    const errorType = problem?.title;

    this.errorHandled(code, errorType);
  }

  private tryTranslationKeys(i18nParams?: any, ...keys: string[]): string {
    for (const key of keys) {
      const translated = this.i18n.instant(key, i18nParams);
      if (translated !== key) {
        return translated;
      }
    }
    return keys[keys.length - 1];
  }

  private setupStatusUrlMappings() {
    this.statusCodeUrlMapping ??= {};

    if (this.notFoundUrl !== null && !(HTTP_NOT_FOUND_STATUS_CODE in this.statusCodeUrlMapping)) {
      this.statusCodeUrlMapping[HTTP_NOT_FOUND_STATUS_CODE] = this.notFoundUrl;
    }

    if (this.notFoundUrl !== null && !(GRPC_NOT_FOUND_STATUS_CODE in this.statusCodeUrlMapping)) {
      this.statusCodeUrlMapping[GRPC_NOT_FOUND_STATUS_CODE] = this.notFoundUrl;
    }

    if (this.permissionDeniedUrl !== null && !(HTTP_PERMISSION_DENIED_CODE in this.statusCodeUrlMapping)) {
      this.statusCodeUrlMapping[HTTP_PERMISSION_DENIED_CODE] = this.permissionDeniedUrl;
    }

    if (this.permissionDeniedUrl !== null && !(GRPC_PERMISSION_DENIED_CODE in this.statusCodeUrlMapping)) {
      this.statusCodeUrlMapping[GRPC_PERMISSION_DENIED_CODE] = this.permissionDeniedUrl;
    }
  }
}
