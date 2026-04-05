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
  selector: 'app-register',
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
      <div class="register-form">
        <div class="form-header">
          <button class="back-button" (click)="goBack()" aria-label="Go back">
            ← Back
          </button>
          <h1>Create Account</h1>
          <p>Join ALUXE today</p>
        </div>

        <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
          <app-input
            id="name"
            type="text"
            label="Full Name"
            placeholder="Enter your full name"
            [(ngModel)]="name"
            name="name"
           [required]="true"
            [error]="nameError"
          ></app-input>

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
            placeholder="Enter a strong password"
            [(ngModel)]="password"
            name="password"
            [required]="true"
            [error]="passwordError"
            helperText="Min. 8 characters with uppercase, lowercase, and numbers"
          ></app-input>

          <app-input
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            [(ngModel)]="confirmPassword"
            name="confirmPassword"
            [required]="true"
            [error]="confirmPasswordError"
          ></app-input>

          <div class="terms">
            <input type="checkbox" id="terms" [(ngModel)]="agreeTerms" name="terms" />
            <label for="terms">
              I agree to the
              <a href="#">Terms of Service</a> and
              <a href="#">Privacy Policy</a>
            </label>
          </div>

          <app-button
            variant="primary"
            type="submit"
            [fullWidth]="true"
            [loading]="authService.isLoading()"
            [disabled]="!registerForm.valid || !agreeTerms || authService.isLoading()"
          >
            {{ authService.isLoading() ? 'Creating Account...' : 'Create Account' }}
          </app-button>
        </form>

        <div class="login-prompt">
          Already have an account?
          <a routerLink="/auth/login" class="login-link">Login here</a>
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

    .register-form {
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

    .terms {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      font-size: 0.9rem;

      input[type='checkbox'] {
        margin-top: 0.25rem;
        cursor: pointer;
        width: auto;
      }

      label {
        margin: 0;
        cursor: pointer;
        color: #666;

        a {
          color: #ffd764;
          font-weight: 500;

          &:hover {
            color: #d4a51e;
          }
        }
      }
    }

    .login-prompt {
      text-align: center;
      color: #666;
      font-size: 0.9rem;
      margin-top: 1.5rem;

      .login-link {
        color: #ffd764;
        font-weight: 600;
        transition: color 200ms ease-out;

        &:hover {
          color: #d4a51e;
        }
      }
    }

    @media (max-width: 600px) {
      .register-form {
        padding: 2rem 1.5rem;
      }

      .form-header h1 {
        font-size: 1.5rem;
      }
    }
  `],
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);
  notificationService = inject(NotificationService);

  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  agreeTerms = false;

  nameError = '';
  emailError = '';
  passwordError = '';
  confirmPasswordError = '';

  onSubmit() {
    this.clearErrors();

    if (!this.name) {
      this.nameError = 'Name is required';
      return;
    }

    if (!this.email) {
      this.emailError = 'Email is required';
      return;
    }

    if (!this.password) {
      this.passwordError = 'Password is required';
      return;
    }

    if (this.password.length < 8) {
      this.passwordError = 'Password must be at least 8 characters';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.confirmPasswordError = 'Passwords do not match';
      return;
    }

    this.authService
      .register(this.name, this.email, this.password, this.confirmPassword)
      .subscribe({
        next: (response) => {
          this.notificationService.success('Account created successfully!');
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.notificationService.error(error.error?.message || 'Registration failed');
        },
      });
  }

  private clearErrors() {
    this.nameError = '';
    this.emailError = '';
    this.passwordError = '';
    this.confirmPasswordError = '';
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
