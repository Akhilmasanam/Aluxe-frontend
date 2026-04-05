import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../features/auth/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <div class="admin-container">
      <aside class="admin-sidebar">
        <div class="sidebar-header">
          <h2>ALUXE Admin</h2>
        </div>

        <nav class="sidebar-nav">
          <button class="nav-item" (click)="navigate('/admin/dashboard')" [class.active]="isActive('/admin/dashboard')">
            📊 Dashboard
          </button>
          <button class="nav-item" (click)="navigate('/admin/products')" [class.active]="isActive('/admin/products')">
            🛍️ Products
          </button>
          <button class="nav-item" (click)="navigate('/admin/orders')" [class.active]="isActive('/admin/orders')">
            📦 Orders
          </button>
          <button class="nav-item" (click)="navigate('/admin/users')" [class.active]="isActive('/admin/users')">
            👥 Users
          </button>
        </nav>

        <div class="sidebar-footer">
          <button class="logout-btn" (click)="logout()">🚪 Logout</button>
        </div>
      </aside>

      <main class="admin-main">
        <div class="admin-header">
          <h1>Admin Dashboard</h1>
          <div class="admin-user">
            {{ authService.currentUser()?.name }}
          </div>
        </div>
        <div class="admin-content">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .admin-container {
      display: flex;
      min-height: 100vh;
      background: #f5f5f5;
    }

    .admin-sidebar {
      width: 250px;
      background: linear-gradient(135deg, #1f1f1f 0%, #2d2d2d 100%);
      color: white;
      display: flex;
      flex-direction: column;
      border-right: 2px solid #ffd764;
      position: fixed;
      height: 100vh;
      left: 0;
      top: 0;
      z-index: 100;
    }

    .sidebar-header {
      padding: 2rem 1.5rem;
      border-bottom: 1px solid rgba(255, 215, 100, 0.2);

      h2 {
        margin: 0;
        font-size: 1.2rem;
        letter-spacing: 1px;
        color: #ffd764;
      }
    }

    .sidebar-nav {
      flex: 1;
      padding: 1rem 0;
      display: flex;
      flex-direction: column;
    }

    .nav-item {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.7);
      padding: 1rem 1.5rem;
      text-align: left;
      cursor: pointer;
      transition: all 200ms ease-out;
      font-size: 1rem;
      font-weight: 500;
      border-left: 3px solid transparent;

      &:hover {
        background: rgba(255, 215, 100, 0.1);
        color: #ffd764;
      }

      &.active {
        color: #ffd764;
        background: rgba(255, 215, 100, 0.15);
        border-left-color: #ffd764;
      }
    }

    .sidebar-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid rgba(255, 215, 100, 0.2);
    }

    .logout-btn {
      width: 100%;
      background: #f44336;
      border: none;
      color: white;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: background 200ms ease-out;

      &:hover {
        background: #d32f2f;
      }
    }

    .admin-main {
      margin-left: 250px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .admin-header {
      background: white;
      padding: 2rem;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

      h1 {
        margin: 0;
        font-size: 2rem;
      }
    }

    .admin-user {
      background: #fafafa;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      color: #1f1f1f;
    }

    .admin-content {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
    }

    @media (max-width: 768px) {
      .admin-sidebar {
        width: 200px;
      }

      .admin-main {
        margin-left: 200px;
      }

      .sidebar-nav {
        padding: 0.5rem 0;
      }

      .nav-item {
        padding: 0.75rem 1rem;
        font-size: 0.9rem;
      }

      .admin-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;

        h1 {
          font-size: 1.5rem;
        }
      }
    }
  `],
})
export class AdminLayoutComponent {
  authService = inject(AuthService);
  router = inject(Router);
  currentRoute = '';

  navigate(path: string) {
    this.router.navigate([path]);
    this.currentRoute = path;
  }

  isActive(path: string): boolean {
    return this.router.url.includes(path);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
