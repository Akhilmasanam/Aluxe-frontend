import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  show(
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    duration: number = 4000
  ) {
    const id = Math.random().toString(36).substring(7);
    const toast: Toast = { id, message, type, duration };

    this._toasts.update((toasts) => [...toasts, toast]);

    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
  }

  success(message: string, duration?: number) {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number) {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration?: number) {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration?: number) {
    this.show(message, 'info', duration);
  }

  dismiss(id: string) {
    this._toasts.update((toasts) => toasts.filter((t) => t.id !== id));
  }

  clear() {
    this._toasts.set([]);
  }
}
