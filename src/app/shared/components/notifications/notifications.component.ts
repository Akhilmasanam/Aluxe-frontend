import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notifications-container">
      <div
        *ngFor="let toast of notificationService.toasts()"
        class="notification"
        [class]="'notification-' + toast.type"
      >
        <div class="notification-content">
          <span class="notification-icon">
            <ng-container [ngSwitch]="toast.type">
              <span *ngSwitchCase="'success'" class="icon">✓</span>
              <span *ngSwitchCase="'error'" class="icon">!</span>
              <span *ngSwitchCase="'warning'" class="icon">⚠</span>
              <span *ngSwitchCase="'info'" class="icon">ℹ</span>
            </ng-container>
          </span>
          <p class="message">{{ toast.message }}</p>
        </div>
        <button
          class="close-btn"
          (click)="notificationService.dismiss(toast.id)"
          type="button"
        >
          ×
        </button>
      </div>
    </div>
  `,
  styles: [`
    .notifications-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      max-width: 400px;
      pointer-events: none;
    }

    .notification {
      background: white;
      border-radius: 8px;
      padding: 1rem 1.5rem;
      margin-bottom: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      animation: slideInRight 300ms ease-out;
      pointer-events: auto;
      border-left: 4px solid;

      &.notification-success {
        border-left-color: #4caf50;

        .icon {
          color: #4caf50;
        }
      }

      &.notification-error {
        border-left-color: #f44336;

        .icon {
          color: #f44336;
        }
      }

      &.notification-warning {
        border-left-color: #ff9800;

        .icon {
          color: #ff9800;
        }
      }

      &.notification-info {
        border-left-color: #2196f3;

        .icon {
          color: #2196f3;
        }
      }
    }

    .notification-content {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex: 1;
    }

    .notification-icon {
      min-width: 24px;
      text-align: center;
    }

    .icon {
      font-weight: bold;
      font-size: 1.2rem;
    }

    .message {
      margin: 0;
      font-size: 0.95rem;
      color: #1f1f1f;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #999;
      padding: 0;
      min-width: unset;
      transition: color 200ms ease-out;

      &:hover {
        color: #1f1f1f;
      }
    }

    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @media (max-width: 767px) {
      .notifications-container {
        left: 20px;
        right: 20px;
        max-width: unset;
      }
    }
  `],
})
export class NotificationsComponent {
  notificationService = inject(NotificationService);
}
