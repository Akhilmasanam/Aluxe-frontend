import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../../../shared/models';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent],
  template: `
    <section class="orders-section">
      <div class="container">
        <div class="orders-header">
          <button class="back-button" (click)="goBack()" aria-label="Go back">
            ← Back
          </button>
          <h1>My Orders</h1>
        </div>

        <div class="orders-list" *ngIf="orders && orders.length > 0; else noOrders">
          <app-card *ngFor="let order of orders" class="order-card">
            <div class="order-header">
              <div class="order-info">
                <h3>Order #{{ order.id | slice: 0: 8 }}</h3>
                <p class="order-date">{{ order.createdAt | date: 'short' }}</p>
              </div>
              <div class="order-status" [class]="'status-' + order.status">
                {{ order.status | titlecase }}
              </div>
            </div>

            <div class="order-items">
              <span class="items-count">{{ order.items?.length || 0 }} items</span>
              <span class="order-total">₹{{ order.totalPrice }}</span>
            </div>

            <div class="order-payment">
              <span class="payment-status" [class]="'payment-' + order.paymentStatus">
                Payment: {{ order.paymentStatus | titlecase }}
              </span>
            </div>

            <div class="order-address">
              <p>{{ order.shippingAddress }}</p>
            </div>

            <a [routerLink]="['/orders', order.id]" class="view-details">
              View Order Details →
            </a>
          </app-card>
        </div>

        <ng-template #noOrders>
          <div class="no-orders">
            <p>No orders yet</p>
            <a routerLink="/products" class="shop-link">
              Start Shopping
            </a>
          </div>
        </ng-template>
      </div>
    </section>
  `,
  styleUrls: ['./order-history.component.scss'],
})
export class OrderHistoryComponent implements OnInit {
  orderService = inject(OrderService);
  notificationService = inject(NotificationService);
  router = inject(Router);

  orders: Order[] = [];

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getUserOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
      },
      error: () => {
        this.notificationService.error('Failed to load orders');
      },
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
