import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Product, CartItem } from '../../../shared/models';

const API_URL = 'http://localhost:5000/api';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);

  private readonly _cartItems = signal<CartItem[]>(this.getStoredCart());

  readonly cartItems = this._cartItems.asReadonly();
  readonly cartCount = computed(() =>
    this._cartItems().reduce((total, item) => total + item.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this._cartItems().reduce((total, item) => {
      const price = item.product?.discountPrice || item.product?.price || item.price;
      return total + price * item.quantity;
    }, 0)
  );

  readonly tax = computed(() => this.subtotal() * 0.1); // 10% tax
  readonly total = computed(() => this.subtotal() + this.tax());

  private getStoredCart(): CartItem[] {
    try {
      const stored = localStorage.getItem('cart');
      return stored ? (JSON.parse(stored) as CartItem[]) : [];
    } catch {
      return [];
    }
  }

  private saveCart(items: CartItem[]): void {
    localStorage.setItem('cart', JSON.stringify(items));
    this._cartItems.set(items);
  }

  addToCart(product: Product, quantity: number = 1): void {
    const items = [...this._cartItems()];
    const existing = items.find((i) => i.productId === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({
        productId: product.id,
        product,
        quantity,
        price: product.discountPrice || product.price,
      });
    }

    this.saveCart(items);
  }

  removeFromCart(productId: string): void {
    this.saveCart(this._cartItems().filter((i) => i.productId !== productId));
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const items = this._cartItems().map((i) =>
      i.productId === productId ? { ...i, quantity } : i
    );
    this.saveCart(items);
  }

  clearCart(): void {
    this.saveCart([]);
  }

  getCartForCheckout(): CartItem[] {
    return this._cartItems();
  }
}
