import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="auth-layout">
      <div class="auth-container">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .auth-layout {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1f1f1f 0%, #2d2d2d 100%);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -50%;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(255, 215, 100, 0.1) 1px, transparent 1px);
        background-size: 50px 50px;
        animation: moveGradient 20s linear infinite;
      }
    }

    .auth-container {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 450px;
      padding: 2rem;
    }

    @keyframes moveGradient {
      0% {
        transform: translate(0, 0);
      }
      100% {
        transform: translate(50px, 50px);
      }
    }

    @media (max-width: 600px) {
      .auth-container {
        padding: 1.5rem;
      }
    }
  `],
})
export class AuthLayoutComponent {}
