import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, CardComponent],
  template: `
    <section class="cart-section">
      <div class="container">
        <div class="cart-header">
          <button class="back-button" (click)="goBack()" aria-label="Go back">
            ← Back
          </button>
          <h1>Shopping Cart</h1>
        </div>

        <div class="cart-layout">
          <!-- Cart Items -->
          <main class="cart-items">
            <div *ngIf="cartService.cartItems().length > 0; else emptyCart">
              <app-card *ngFor="let item of cartService.cartItems()" class="cart-item">
                <div class="item-content">
                  <img [src]="item.product?.image" [alt]="item.product?.name" class="item-image" />
                  <div class="item-details">
                    <h3>{{ item.product?.name }}</h3>
                    <p class="item-category">{{ item.product?.category | titlecase }}</p>
                    <div class="item-price">
                      ₹{{ item.price }}
                    </div>
                  </div>

                  <div class="quantity-control">
                    <button (click)="decreaseQuantity(item.productId)" [disabled]="item.quantity <= 1">−</button>
                    <span>{{ item.quantity }}</span>
                    <button (click)="increaseQuantity(item.productId)">+</button>
                  </div>

                  <div class="item-total">
                    ₹{{ item.price * item.quantity }}
                  </div>

                  <button class="remove-btn" (click)="removeItem(item.productId)">🗑️</button>
                </div>
              </app-card>

              <button class="clear-cart-btn" (click)="clearCart()">Clear Cart</button>
            </div>
            <ng-template #emptyCart>
              <div class="empty-cart">
                <p>Your cart is empty</p>
                <a routerLink="/products">
                  <app-button variant="primary">
                    Continue Shopping
                  </app-button>
                </a>
              </div>
            </ng-template>
          </main>

          <!-- Cart Summary -->
          <aside class="cart-summary" *ngIf="cartService.cartItems().length > 0">
            <app-card [elevated]="true">
              <div class="summary-content">
                <h2>Order Summary</h2>

                <div class="summary-row">
                  <span>Subtotal:</span>
                  <span>₹{{ cartService.subtotal() | number: '1.2-2' }}</span>
                </div>

                <div class="summary-row">
                  <span>Tax (10%):</span>
                  <span>₹{{ cartService.tax() | number: '1.2-2' }}</span>
                </div>

                <div class="summary-row total">
                  <span>Total:</span>
                  <span>₹{{ cartService.total() | number: '1.2-2' }}</span>
                </div>

                <a routerLink="/checkout">
                  <app-button variant="primary" size="lg" [fullWidth]="true">
                    Proceed to Checkout
                  </app-button>
                </a>

                <a routerLink="/products" class="continue-shopping">
                  Continue Shopping
                </a>
              </div>
            </app-card>
          </aside>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  cartService = inject(CartService);
  notificationService = inject(NotificationService);
  router = inject(Router);

  increaseQuantity(productId: string) {
    const item = this.cartService.cartItems().find((i) => i.productId === productId);
    if (item?.product && item.quantity < item.product.stock) {
      this.cartService.updateQuantity(productId, item.quantity + 1);
    }
  }

  decreaseQuantity(productId: string) {
    const item = this.cartService.cartItems().find((i) => i.productId === productId);
    if (item && item.quantity > 1) {
      this.cartService.updateQuantity(productId, item.quantity - 1);
    }
  }

  removeItem(productId: string) {
    this.cartService.removeFromCart(productId);
    this.notificationService.info('Item removed from cart');
  }

  clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart();
      this.notificationService.warning('Cart cleared');
    }
  }

  goBack() {
    this.router.navigate(['/products']);
  }
}
