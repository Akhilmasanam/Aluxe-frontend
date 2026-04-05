import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../../orders/services/order.service';
import { PaymentService } from '../../../payment/services/payment.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { InputComponent } from '../../../../shared/components/input/input.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, CardComponent, InputComponent],
  template: `
    <section class="checkout-section">
      <div class="container">
        <div class="checkout-header">
          <button class="back-button" (click)="goBack()" aria-label="Go back">
            ← Back to Cart
          </button>
          <h1>Checkout</h1>
        </div>

        <div class="checkout-layout">
          <!-- Shipping Form -->
          <main class="checkout-form-section">
            <app-card>
              <form (ngSubmit)="onSubmit()">
                <div class="form-section">
                  <h2>Shipping Address</h2>

                  <app-input
                    id="fullName"
                    type="text"
                    label="Full Name"
                    placeholder="Enter your full name"
                    [(ngModel)]="address.name"
                    name="name"
                    [required]="true"
                  ></app-input>

                  <app-input
                    id="email"
                    type="email"
                    label="Email"
                    placeholder="Enter your email"
                    [(ngModel)]="address.email"
                    name="email"
                    [required]="true"
                  ></app-input>

                  <app-input
                    id="phone"
                    type="tel"
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    [(ngModel)]="address.phone"
                    name="phone"
                    [required]="true"
                  ></app-input>

                  <app-input
                    id="address"
                    type="text"
                    label="Street Address"
                    placeholder="Enter your street address"
                    [(ngModel)]="address.address"
                    name="address"
                    [required]="true"
                  ></app-input>

                  <div class="form-row">
                    <app-input
                      id="city"
                      type="text"
                      label="City"
                      placeholder="Enter city"
                      [(ngModel)]="address.city"
                      name="city"
                      [required]="true"
                    ></app-input>

                    <app-input
                      id="state"
                      type="text"
                      label="State"
                      placeholder="Enter state"
                      [(ngModel)]="address.state"
                      name="state"
                      [required]="true"
                    ></app-input>
                  </div>

                  <app-input
                    id="zipCode"
                    type="text"
                    label="Postal Code"
                    placeholder="Enter postal code"
                    [(ngModel)]="address.zipCode"
                    name="zipCode"
                    [required]="true"
                  ></app-input>
                </div>

                <div class="form-section">
                  <h2>Payment Method</h2>

                  <div class="payment-options">
                    <label>
                      <input
                        type="radio"
                        value="card"
                        [(ngModel)]="paymentMethod"
                        name="payment"
                      />
                      <span>Credit/Debit Card (Razorpay)</span>
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="upi"
                        [(ngModel)]="paymentMethod"
                        name="payment"
                      />
                      <span>UPI</span>
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="netbanking"
                        [(ngModel)]="paymentMethod"
                        name="payment"
                      />
                      <span>Net Banking</span>
                    </label>
                  </div>
                </div>

                <app-button
                  variant="primary"
                  size="lg"
                  [fullWidth]="true"
                  type="submit"
                  [loading]="isLoading()"
                  [disabled]="isLoading()"
                >
                  {{ isLoading() ? 'Processing...' : 'Place Order & Pay' }}
                </app-button>
              </form>
            </app-card>
          </main>

          <!-- Order Summary -->
          <aside class="order-summary">
            <app-card [elevated]="true">
              <div class="summary-content">
                <h2>Order Summary</h2>

                <div class="summary-items">
                  <div
                    *ngFor="let item of cartService.cartItems()"
                    class="summary-item"
                  >
                    <div class="item-info">
                      <span class="item-name">{{ item.product?.name }}</span>
                      <span class="item-qty">x{{ item.quantity }}</span>
                    </div>
                    <span class="item-price">₹{{ item.price * item.quantity }}</span>
                  </div>
                </div>

                <div class="divider"></div>

                <div class="summary-totals">
                  <div class="total-row">
                    <span>Subtotal:</span>
                    <span>₹{{ cartService.subtotal() | number: '1.2-2' }}</span>
                  </div>
                  <div class="total-row">
                    <span>Tax (10%):</span>
                    <span>₹{{ cartService.tax() | number: '1.2-2' }}</span>
                  </div>
                  <div class="total-row grand-total">
                    <span>Total:</span>
                    <span>₹{{ cartService.total() | number: '1.2-2' }}</span>
                  </div>
                </div>
              </div>
            </app-card>
          </aside>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent {
  authService = inject(AuthService);
  cartService = inject(CartService);
  orderService = inject(OrderService);
  paymentService = inject(PaymentService);
  router = inject(Router);
  notificationService = inject(NotificationService);

  isLoading = signal(false);

  address = {
    name: this.authService.currentUser()?.name || '',
    email: this.authService.currentUser()?.email || '',
    phone: this.authService.currentUser()?.phone || '',
    address: this.authService.currentUser()?.address || '',
    city: this.authService.currentUser()?.city || '',
    state: this.authService.currentUser()?.state || '',
    zipCode: this.authService.currentUser()?.zipCode || '',
  };

  paymentMethod = 'card';

  onSubmit() {
    if (this.cartService.cartItems().length === 0) {
      this.notificationService.error('Cart is empty');
      return;
    }

    this.isLoading.set(true);

    // Create order first
    const orderData = {
      items: this.cartService.cartItems().map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice: this.cartService.total(),
      shippingAddress: `${this.address.address}, ${this.address.city}, ${this.address.state} ${this.address.zipCode}`,
      paymentMethod: this.paymentMethod,
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        // Proceed to payment
        this.initiatePayment(response);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.notificationService.error('Failed to create order');
      },
    });
  }

  private initiatePayment(order: any) {
    // Razorpay payment implementation
    this.paymentService.createRazorpayOrder({
      orderId: order.id,
      amount: order.totalPrice,
      customerEmail: this.address.email,
      customerName: this.address.name,
    }).subscribe({
      next: (razorpayOrder) => {
        this.paymentService.openRazorpayCheckout({
          key: 'YOUR_RAZORPAY_KEY', // Set from env
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          order_id: razorpayOrder.razorpayOrderId || '',
          name: 'ALUXE',
          description: 'Premium Fashion & Jewelry',
          customer_name: this.address.name,
          customer_email: this.address.email,
          onSuccess: (response) => this.handlePaymentSuccess(response, order),
          onError: (error) => this.handlePaymentError(error),
        });
      },
      error: () => {
        this.isLoading.set(false);
        this.notificationService.error('Failed to initiate payment');
      },
    });
  }

  private handlePaymentSuccess(response: any, order: any) {
    this.paymentService
      .verifyPayment({
        orderId: order.id,
        razorpayOrderId: response.razorpay_order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
      })
      .subscribe({
        next: () => {
          this.notificationService.success('Payment successful!');
          this.cartService.clearCart();
          this.router.navigate(['/orders', order.id]);
        },
        error: () => {
          this.notificationService.error('Payment verification failed');
          this.isLoading.set(false);
        },
      });
  }

  private handlePaymentError(error: any) {
    this.isLoading.set(false);
    this.notificationService.error('Payment failed or cancelled');
  }

  goBack() {
    this.router.navigate(['/cart']);
  }
}
