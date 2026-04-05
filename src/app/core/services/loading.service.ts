import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly _isLoading = signal(false);
  readonly isLoading = this._isLoading.asReadonly();

  private loadingCounter = 0;

  show() {
    this.loadingCounter++;
    this._isLoading.set(true);
  }

  hide() {
    if (this.loadingCounter > 0) {
      this.loadingCounter--;
    }
    if (this.loadingCounter === 0) {
      this._isLoading.set(false);
    }
  }

  reset() {
    this.loadingCounter = 0;
    this._isLoading.set(false);
  }
}
