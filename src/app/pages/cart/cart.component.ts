import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterModule, MatButtonModule, MatIconModule, MatTableModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  protected readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  readonly displayedColumns = ['product', 'price', 'quantity', 'subtotal', 'action'];

  // Derived totals from cart signals
  readonly tax = computed(() => this.cartService.cartTotal() * 0.1);
  readonly grandTotal = computed(() => this.cartService.cartTotal() * 1.1);

  updateQuantity(productId: string, event: Event): void {
    const qty = parseInt((event.target as HTMLInputElement).value, 10);
    if (qty > 0) {
      this.cartService.updateQuantity(productId, qty);
    }
  }

  removeFromCart(productId: string): void {
    this.cartService.removeFromCart(productId);
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
  }
}
