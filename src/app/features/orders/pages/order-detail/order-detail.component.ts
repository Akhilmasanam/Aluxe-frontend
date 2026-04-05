import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../../../shared/models';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent],
  template: `
    <section class="order-detail-section" *ngIf="order">
      <div class="container">
        <a routerLink="/orders" class="back-link">← Back to Orders</a>

        <div class="order-detail-layout">
          <!-- Order Info -->
          <main class="order-main">
            <app-card>
              <div class="order-header">
                <div>
                  <h1>Order #{{ order.id | slice: 0: 8 }}</h1>
                  <p class="order-date">placed on {{ order.createdAt | date: 'medium' }}</p>
                </div>
                <div class="order-status" [class]="'status-' + order.status">
                  {{ order.status | titlecase }}
                </div>
              </div>

              <div class="order-section">
                <h2>Order Items</h2>
                <div class="order-items">
                  <div *ngFor="let item of order.items" class="order-item">
                    <img [src]="item.product?.image" [alt]="item.product?.name" />
                    <div class="item-details">
                      <h3>{{ item.product?.name }}</h3>
                      <p class="category">{{ item.product?.category | titlecase }}</p>
                    </div>
                    <div class="item-qty">x{{ item.quantity }}</div>
                    <div class="item-price">₹{{ item.price * item.quantity }}</div>
                  </div>
                </div>
              </div>

              <div class="order-section">
                <h2>Delivery Address</h2>
                <p>{{ order.shippingAddress }}</p>
              </div>

              <div class="order-section">
                <h2>Payment Information</h2>
                <div class="payment-info">
                  <div class="info-row">
                    <span>Payment Method:</span>
                    <span>{{ order.paymentMethod | titlecase }}</span>
                  </div>
                  <div class="info-row">
                    <span>Payment Status:</span>
                    <span [class]="'payment-' + order.paymentStatus">
                      {{ order.paymentStatus | titlecase }}
                    </span>
                  </div>
                </div>
              </div>
            </app-card>
          </main>

          <!-- Order Summary -->
          <aside class="order-summary">
            <app-card [elevated]="true">
              <div class="summary-content">
                <h2>Order Summary</h2>

                <div class="summary-row">
                  <span>Subtotal:</span>
                  <span>₹{{ (order.totalPrice * 0.909) | number: '1.2-2' }}</span>
                </div>

                <div class="summary-row">
                  <span>Tax (10%):</span>
                  <span>₹{{ (order.totalPrice * 0.091) | number: '1.2-2' }}</span>
                </div>

                <div class="summary-row total">
                  <span>Total:</span>
                  <span>₹{{ order.totalPrice | number: '1.2-2' }}</span>
                </div>

                <div class="order-timeline">
                  <h3>Order Status Timeline</h3>
                  <div class="timeline">
                    <div class="timeline-item" [class.completed]="order.status !== 'pending'">
                      <div class="timeline-dot"></div>
                      <div class="timeline-label">Pending</div>
                    </div>
                    <div class="timeline-item" [class.completed]="['confirmed', 'shipped', 'delivered'].includes(order.status)">
                      <div class="timeline-dot"></div>
                      <div class="timeline-label">Confirmed</div>
                    </div>
                    <div class="timeline-item" [class.completed]="['shipped', 'delivered'].includes(order.status)">
                      <div class="timeline-dot"></div>
                      <div class="timeline-label">Shipped</div>
                    </div>
                    <div class="timeline-item" [class.completed]="order.status === 'delivered'">
                      <div class="timeline-dot"></div>
                      <div class="timeline-label">Delivered</div>
                    </div>
                  </div>
                </div>
              </div>
            </app-card>
          </aside>
        </div>
      </div>
    </section>

    <div *ngIf="!order" class="loading">Loading order details...</div>
  `,
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit {
  orderService = inject(OrderService);
  notificationService = inject(NotificationService);
  route = inject(ActivatedRoute);

  order: Order | null = null;

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.loadOrder(params['id']);
    });
  }

  loadOrder(id: string) {
    this.orderService.getOrderById(id).subscribe({
      next: (order) => {
        this.order = order;
      },
      error: () => {
        this.notificationService.error('Failed to load order');
      },
    });
  }
}
