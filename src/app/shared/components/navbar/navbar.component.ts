import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { CartService } from '../../../features/cart/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <!-- Logo -->
        <div class="navbar-brand">
          <a routerLink="/" class="logo">
            <h2>ALUXE</h2>
          </a>
        </div>

        <!-- Navigation Links -->
        <div class="navbar-menu">
          <a routerLink="/products" class="nav-link">Products</a>
          <a *ngIf="authService.isAdmin()" routerLink="/admin" class="nav-link">Admin</a>
        </div>

        <!-- Right Section -->
        <div class="navbar-right">
          <!-- Cart Icon -->
          <a routerLink="/cart" class="cart-link">
            <svg class="cart-icon" viewBox="0 0 24 24">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49a1.003 1.003 0 00-.13-1.12c-.23-.3-.58-.48-.96-.48H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            <span class="cart-badge" *ngIf="cartService.cartCount() > 0">
              {{ cartService.cartCount() }}
            </span>
          </a>

          <!-- Auth Links -->
          <ng-container *ngIf="authService.isLoggedInSignal(); else loginLinks">
            <div class="user-menu" [class.dropdown-open]="isDropdownOpen()" (document:click)="closeDropdown($event)">
              <button class="user-button" (click)="toggleDropdown($event)">
                {{ authService.currentUser()?.name?.split(' ')?.[0] }}
                <svg class="dropdown-icon" viewBox="0 0 24 24">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </button>
              <div class="user-dropdown">
                <button class="close-dropdown" (click)="closeDropdown(null)" aria-label="Close menu">×</button>
                <a routerLink="/orders" (click)="closeDropdown(null)" class="dropdown-link">My Orders</a>
                <a routerLink="/profile" (click)="closeDropdown(null)" class="dropdown-link">Profile</a>
                <button (click)="logout()" class="dropdown-link logout">Logout</button>
              </div>
            </div>
          </ng-container>

          <ng-template #loginLinks>
            <a routerLink="/auth/login" class="btn-login">Login</a>
            <a routerLink="/auth/register" class="btn-register">Sign Up</a>
          </ng-template>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: white;
      border-bottom: 1px solid #e0e0e0;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .navbar-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 70px;
    }

    .navbar-brand {
      flex-shrink: 0;
    }

    .logo {
      text-decoration: none;
      color: #1f1f1f;

      h2 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 700;
        letter-spacing: 2px;
      }
    }

    .navbar-menu {
      display: flex;
      gap: 2rem;
      margin-left: 3rem;
      flex: 1;
    }

    .nav-link {
      color: #1f1f1f;
      text-decoration: none;
      font-weight: 500;
      transition: color 200ms ease-out;
      position: relative;

      &:hover {
        color: #ffd764;

        &::after {
          width: 100%;
        }
      }

      &::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 0;
        height: 2px;
        background: #ffd764;
        transition: width 200ms ease-out;
      }
    }

    .navbar-right {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-left: auto;
    }

    .cart-link {
      position: relative;
      color: #1f1f1f;
      text-decoration: none;
      transition: color 200ms ease-out;
    }

    .cart-icon {
      width: 24px;
      height: 24px;
      fill: currentColor;
    }

    .cart-link:hover {
      color: #ffd764;
    }

    .cart-badge {
      position: absolute;
      top: -8px;
      right: -8px;
      background: #ffd764;
      color: #1f1f1f;
      font-size: 0.75rem;
      font-weight: 700;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* User Menu */
    .user-menu {
      position: relative;
    }
  .user-menu:hover.user-dropdown{
    display: block;
  }


    .user-button {
      background: none;
      border: none;
      color: #1f1f1f;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: color 200ms ease-out;

      &:hover {
        color: #ffd764;
      }
    }

    .dropdown-icon {
      width: 16px;
      height: 16px;
      fill: currentColor;
      transition: transform 200ms ease-out;
    }

    .user-menu:hover .dropdown-icon {
      transform: rotate(180deg);
    }

    .user-menu.dropdown-open .dropdown-icon {
      transform: rotate(180deg);
    }

    .user-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 0.5rem;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      min-width: 180px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 200ms ease-out;
      pointer-events: none;
      margin-top:0%;
    }

    .close-dropdown {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: none;
      border: none;
      font-size: 1.2rem;
      color: #999;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 4px;
      transition: all 200ms ease-out;

      &:hover {
        background: #f5f5f5;
        color: #666;
      }
    }

    .user-menu:hover .user-dropdown,
    .user-menu.dropdown-open .user-dropdown {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
      pointer-events: auto;
    }

    .dropdown-link {
      display: block;
      padding: 1rem 1.5rem;
      color: #1f1f1f;
      text-decoration: none;
      font-weight: 500;
      transition: all 200ms ease-out;
      background: none;
      border: none;
      width: 100%;
      text-align: left;
      cursor: pointer;

      &:hover {
        background: #fafafa;
        color: #ffd764;
      }

      &.logout {
        color: #f44336;

        &:hover {
          background: rgba(244, 67, 54, 0.1);
        }
      }
    }

    /* Auth Buttons */
    .btn-login,
    .btn-register {
      text-decoration: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      transition: all 200ms ease-out;
      font-size: 0.95rem;
      display: inline-flex;
      align-items: center;
    }

    .btn-login {
      color: #1f1f1f;
      border: 2px solid #1f1f1f;

      &:hover {
        background: #1f1f1f;
        color: white;
      }
    }

    .btn-register {
      background: linear-gradient(135deg, #ffd764 0%, #d4a51e 100%);
      color: #1f1f1f;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(255, 215, 100, 0.3);
      }
    }

    @media (max-width: 768px) {
      .navbar-menu {
        display: none;
      }

      .navbar-right {
        gap: 1rem;
      }

      .btn-register {
        display: none;
      }
    }
  `],
})
export class NavbarComponent {
  authService = inject(AuthService);
  cartService = inject(CartService);

  isDropdownOpen = signal(false);

  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.isDropdownOpen.update(v => !v);
  }

  closeDropdown(event: MouseEvent | null): void {
    if (event) {
      event.stopPropagation();
    }
    this.isDropdownOpen.set(false);
  }

  logout() {
    this.authService.logout();
    this.isDropdownOpen.set(false);
  }
}
