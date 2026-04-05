import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

type ButtonVariant = 'primary' | 'secondary' | 'light' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [class]="buttonClass"
      [disabled]="disabled"
      [type]="type"
      (click)="click.emit()"
    >
      <span *ngIf="loading" class="loader"></span>
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-weight: 600;
      border-radius: 8px;
      transition: all 300ms ease-out;
      cursor: pointer;
      border: none;
      padding: 0.75rem 1.5rem;
      font-size: 1rem;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      &:focus-visible {
        outline: 2px solid #ffd764;
        outline-offset: 2px;
      }
    }

    /* Primary */
    .btn-primary {
      background: linear-gradient(135deg, #ffd764 0%, #d4a51e 100%);
      color: #1f1f1f;
    }

    /* Secondary */
    .btn-secondary {
      background-color: #1f1f1f;
      color: #ffd764;
      border: 2px solid #ffd764;

      &:hover:not(:disabled) {
        background-color: #ffd764;
        color: #1f1f1f;
      }
    }

    /* Light */
    .btn-light {
      background-color: #fafafa;
      color: #1f1f1f;

      &:hover:not(:disabled) {
        background-color: #e0e0e0;
      }
    }

    /* Danger */
    .btn-danger {
      background-color: #f44336;
      color: white;
    }

    /* Success */
    .btn-success {
      background-color: #4caf50;
      color: white;
    }

    /* Sizes */
    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }

    .btn-lg {
      padding: 1rem 2rem;
      font-size: 1.2rem;
    }

    .btn-full {
      width: 100%;
    }

    .loader {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 600ms linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `],
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() fullWidth = false;

  @Output() click = new EventEmitter<void>();

  get buttonClass(): string {
    const classes = [
      `btn-${this.variant}`,
      `btn-${this.size}`,
    ];
    if (this.fullWidth) classes.push('btn-full');
    return classes.join(' ');
  }
}
