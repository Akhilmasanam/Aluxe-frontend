import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../models';

@Injectable({ providedIn: 'root' })
export class CartService {
  // Signals-based cart state
  private readonly _cartItems = signal<CartItem[]>(this.getStoredCart());

  // Public readonly signals
  readonly cartItems = this._cartItems.asReadonly();
  readonly cartCount = computed(() =>
    this._cartItems().reduce((total, item) => total + item.quantity, 0)
  );
  readonly cartTotal = computed(() =>
    this._cartItems().reduce((total, item) => total + item.price * item.quantity, 0)
  );

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

  addToCart(item: CartItem): void {
    const items = [...this._cartItems()];
    const existing = items.find((i) => i.productId === item.productId);

    if (existing) {
      existing.quantity += item.quantity;
    } else {
      items.push(item);
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
}
