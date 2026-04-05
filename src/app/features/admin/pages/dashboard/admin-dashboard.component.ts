import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { OrderService } from '../../../orders/services/order.service';
import { ProductService } from '../../../products/services/product.service';
import { AuthService } from '../../../auth/services/auth.service';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent],
  template: `
    <section class="dashboard-section">
      <div class="dashboard-header">
        <h1>Welcome back, {{ authService.currentUser()?.name }}</h1>
        <p>Dashboard Overview</p>
      </div>

      <!-- Analytics Cards -->
      <div class="analytics-grid">
        <app-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon users">👥</div>
            <div class="stat-info">
              <p class="stat-label">Total Users</p>
              <h3 class="stat-value">{{ totalUsers }}</h3>
            </div>
          </div>
        </app-card>

        <app-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon orders">📦</div>
            <div class="stat-info">
              <p class="stat-label">Total Orders</p>
              <h3 class="stat-value">{{ totalOrders }}</h3>
            </div>
          </div>
        </app-card>

        <app-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon revenue">💰</div>
            <div class="stat-info">
              <p class="stat-label">Total Revenue</p>
              <h3 class="stat-value">₹{{ totalRevenue | number: '1.2-2' }}</h3>
            </div>
          </div>
        </app-card>

        <app-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon products">🛍️</div>
            <div class="stat-info">
              <p class="stat-label">Total Products</p>
              <h3 class="stat-value">{{ totalProducts }}</h3>
            </div>
          </div>
        </app-card>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <a routerLink="/admin/products" class="action-btn">
            <span>📝</span>
            <span>Manage Products</span>
          </a>
          <a routerLink="/admin/orders" class="action-btn">
            <span>📋</span>
            <span>View Orders</span>
          </a>
          <a routerLink="/admin/users" class="action-btn">
            <span>👤</span>
            <span>Manage Users</span>
          </a>
          <a routerLink="/admin/analytics" class="action-btn">
            <span>📊</span>
            <span>Analytics</span>
          </a>
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="recent-section">
        <h2>Recent Orders</h2>
        <app-card>
          <table class="orders-table" *ngIf="recentOrders.length > 0; else noOrders">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let order of recentOrders">
                <td><a [routerLink]="['/admin/orders', order.id]">{{ order.id | slice: 0: 8 }}...</a></td>
                <td>{{ order.user?.name }}</td>
                <td>₹{{ order.totalPrice }}</td>
                <td>
                  <span class="status-badge" [class]="'status-' + order.status">
                    {{ order.status }}
                  </span>
                </td>
                <td>{{ order.createdAt | date: 'short' }}</td>
              </tr>
            </tbody>
          </table>
          <ng-template #noOrders>
            <p style="text-align: center; color: #999;">No recent orders</p>
          </ng-template>
        </app-card>
      </div>
    </section>
  `,
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  orderService = inject(OrderService);
  productService = inject(ProductService);
  authService = inject(AuthService);
  router = inject(Router);

  private readonly destroy$ = new Subject<void>();

  totalUsers = 0;
  totalOrders = 0;
  totalRevenue = 0;
  totalProducts = 0;
  recentOrders: any[] = [];

  ngOnInit() {
    this.loadDashboardData();

    // Reload dashboard data when navigating back to dashboard
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd && event.url === '/admin/dashboard'),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        console.log('Reloading dashboard data');
        this.loadDashboardData();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboardData() {
    // Load all orders
    this.orderService.getAllOrders().subscribe({
      next: (orders: any[]) => {
        this.totalOrders = orders.length;
        this.totalRevenue = orders.reduce((sum: number, order: any) => sum + order.totalPrice, 0);
        this.recentOrders = orders.slice(0, 5);
      },
    });

    // Load all products
    this.productService.getProducts({}).subscribe({
      next: (response) => {
        this.totalProducts = response.pagination?.total || 0;
      },
    });

    // TODO: Load total users (requires backend endpoint)
    // this.userService.getAllUsers().subscribe(users => {
    //   this.totalUsers = users.length;
    // });
  }
}
