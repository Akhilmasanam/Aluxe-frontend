import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../orders/services/order.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { CardComponent } from '../../../../shared/components/card/card.component';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CardComponent],
  template: `
    <section class="admin-orders-section">
      <div class="header-section">
        <h1>Orders Management</h1>
        <p class="subtitle">Total Orders: {{ orders.length }}</p>
      </div>

      <!-- Filter Status -->
      <app-card class="filter-section">
        <div class="filter-controls">
          <label>
            Filter by Status:
            <select [(ngModel)]="filterStatus" (change)="applyFilters()">
              <option value="">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>
        </div>
      </app-card>

      <!-- Orders Table -->
      <app-card>
        <table class="orders-table" *ngIf="filteredOrders.length > 0; else noOrders">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Items</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let order of filteredOrders">
              <td>{{ order.id | slice: 0: 8 }}...</td>
              <td>{{ order.user?.name }}</td>
              <td>₹{{ order.totalPrice }}</td>
              <td>{{ order.items?.length || 0 }}</td>
              <td>
                <select
                  [(ngModel)]="order.status"
                  (change)="updateOrderStatus(order.id, order.status)"
                  [class]="'status-select status-' + order.status"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
              <td>
                <span class="payment-badge" [class]="'payment-' + order.paymentStatus">
                  {{ order.paymentStatus }}
                </span>
              </td>
              <td>{{ order.createdAt | date: 'short' }}</td>
              <td>
                <a [routerLink]="['/admin/orders', order.id]">
                  <button class="view-btn">👁️ View</button>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
        <ng-template #noOrders>
          <p style="text-align: center; color: #999; padding: 2rem;">No orders found</p>
        </ng-template>
      </app-card>
    </section>
  `,
  styleUrls: ['./admin-orders.component.scss'],
})
export class AdminOrdersComponent implements OnInit {
  orderService = inject(OrderService);
  notificationService = inject(NotificationService);

  orders: any[] = [];
  filteredOrders: any[] = [];
  filterStatus = '';

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.applyFilters();
      },
      error: () => {
        this.notificationService.error('Failed to load orders');
      },
    });
  }

  applyFilters() {
    if (this.filterStatus) {
      this.filteredOrders = this.orders.filter((o) => o.status === this.filterStatus);
    } else {
      this.filteredOrders = this.orders;
    }
  }

  updateOrderStatus(orderId: string, newStatus: string) {
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        this.notificationService.success('Order status updated');
      },
      error: () => {
        this.notificationService.error('Failed to update order status');
      },
    });
  }
}
