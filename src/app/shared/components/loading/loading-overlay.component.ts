import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="loadingService.isLoading()" class="loading-overlay">
      <div class="spinner-container">
        <div class="spinner"></div>
        <p class="loading-text">Loading...</p>
      </div>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 200ms ease-out;
    }

    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 3px solid rgba(255, 215, 100, 0.3);
      border-top-color: #ffd764;
      border-radius: 50%;
      animation: spin 800ms linear infinite;
    }

    .loading-text {
      color: #ffd764;
      font-weight: 600;
      margin: 0;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `],
})
export class LoadingOverlayComponent {
  loadingService = inject(LoadingService);
}
