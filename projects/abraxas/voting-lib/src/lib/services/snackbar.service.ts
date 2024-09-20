/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private readonly messageSubject: Subject<SnackbarMessage> = new Subject<SnackbarMessage>();

  public get message$(): Observable<SnackbarMessage> {
    return this.messageSubject;
  }

  public success(message: string): void {
    this.messageSubject.next({ message, variant: 'success' });
  }

  public error(message: string): void {
    this.messageSubject.next({ message, variant: 'error' });
  }

  public info(message: string): void {
    this.messageSubject.next({ message, variant: 'info' });
  }

  public warning(message: string): void {
    this.messageSubject.next({ message, variant: 'warning' });
  }

  public primary(message: string): void {
    this.messageSubject.next({ message, variant: 'primary' });
  }

  public basic(message: string): void {
    this.messageSubject.next({ message, variant: 'basic' });
  }
}

export interface SnackbarMessage {
  message: string;
  variant: 'basic' | 'error' | 'info' | 'primary' | 'success' | 'warning';
}
