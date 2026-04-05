import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { CardComponent } from '../../../../shared/components/card/card.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonComponent,
    InputComponent,
    CardComponent,
  ],
  template: `
    <app-card [elevated]="true">
      <div class="login-form">
        <div class="form-header">
          <button class="back-button" (click)="goBack()" aria-label="Go back">
            ← Back
          </button>
          <h1>Welcome Back</h1>
          <p>To continue to ALUXE</p>
        </div>

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <app-input
            id="email"
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            [(ngModel)]="email"
            name="email"
            [required]="true"
            [error]="emailError"
          ></app-input>

          <app-input
            id="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            [(ngModel)]="password"
            name="password"
             [required]="true"
            [error]="passwordError"
          ></app-input>

          <div class="form-footer">
            <a href="#" class="forgot-password">Forgot password?</a>
          </div>

          <app-button
            variant="primary"
            type="submit"
            [fullWidth]="true"
            [loading]="authService.isLoading()"
            [disabled]="!loginForm.valid || authService.isLoading()"
          >
            {{ authService.isLoading() ? 'Logging in...' : 'Login' }}
          </app-button>
        </form>

        <div class="form-divider">
          <span>or</span>
        </div>

        <div class="signup-prompt">
          Don't have an account?
          <a routerLink="/auth/register" class="signup-link">Sign up here</a>
        </div>
      </div>
    </app-card>
  `,
  styles: [`
    app-card {
      width: 100%;
      max-width: 450px;
      background: white;
      border-radius: 16px;
      overflow: hidden;
    }

    .login-form {
      padding: 3rem 2rem;
    }

    .form-header {
      text-align: center;
      margin-bottom: 2rem;
      position: relative;

      .back-button {
        position: absolute;
        left: 0;
        top: 0;
        background: none;
        border: none;
        color: #666;
        font-size: 0.9rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 4px;
        transition: all 200ms ease-out;

        &:hover {
          background: #f5f5f5;
          color: #333;
        }
      }

      h1 {
        font-size: 2rem;
        margin-bottom: 0.5rem;
        background: linear-gradient(135deg, #1f1f1f 0%, #ffd764 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      p {
        color: #999;
        font-size: 0.95rem;
        margin: 0;
      }
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-footer {
      display: flex;
      justify-content: flex-end;
    }

    .forgot-password {
      color: #ffd764;
      font-size: 0.9rem;
      text-decoration: none;
      font-weight: 500;
      transition: color 200ms ease-out;

      &:hover {
        color: #d4a51e;
      }
    }

    .form-divider {
      display: flex;
      align-items: center;
      gap: 1rem;
      color: #ccc;
      margin: 0.5rem 0;

      &::before,
      &::after {
        content: '';
        flex: 1;
        height: 1px;
        background: #e0e0e0;
      }

      span {
        font-size: 0.85rem;
      }
    }

    .signup-prompt {
      text-align: center;
      color: #666;
      font-size: 0.9rem;

      .signup-link {
        color: #ffd764;
        font-weight: 600;
        transition: color 200ms ease-out;

        &:hover {
          color: #d4a51e;
        }
      }
    }

    @media (max-width: 600px) {
      .login-form {
        padding: 2rem 1.5rem;
      }

      .form-header h1 {
        font-size: 1.5rem;
      }
    }
  `],
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  notificationService = inject(NotificationService);

  email = '';
  password = '';
  emailError = '';
  passwordError = '';

  onSubmit() {
    this.emailError = '';
    this.passwordError = '';

    if (!this.email) {
      this.emailError = 'Email is required';
      return;
    }

    if (!this.password) {
      this.passwordError = 'Password is required';
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.notificationService.success('Login successful!');
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.notificationService.error(error.error?.message || 'Login failed');
      },
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
