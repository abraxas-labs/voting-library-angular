/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

const contentTypeKey = 'content-type';
const acceptKey = 'accept';
const contentDispositionKey = 'content-disposition';
const filenameRegex: RegExp = /filename\*=UTF-8''?([^;]*)/;

@Injectable({
  providedIn: 'root',
})
export class FileDownloadService {
  constructor(private readonly http: HttpClient) {}

  public async postDownloadFile(url: string, body: any, acceptContentType?: string): Promise<void> {
    const headers = new HttpHeaders();
    if (acceptContentType !== undefined) {
      headers.set(acceptKey, acceptContentType);
    }

    const response = await firstValueFrom(this.http.post(url, body, { responseType: 'blob', observe: 'response', headers }));
    this.saveFile(response);
  }

  private saveFile(response: HttpResponse<Blob>): void {
    const contentType = response.headers.get(contentTypeKey);
    const filename = this.getFilename(response);

    if (!response.body || !contentType || !filename) {
      return;
    }

    const blob = new Blob([response.body], { type: contentType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
    link.remove();
  }

  private getFilename(response: HttpResponse<Blob>): string | undefined {
    const contentDisposition = response.headers.get(contentDispositionKey);
    if (!contentDisposition) {
      return undefined;
    }

    const matches = filenameRegex.exec(contentDisposition);
    return matches != null && matches[1] ? decodeURIComponent(matches[1]) : undefined;
  }
}
