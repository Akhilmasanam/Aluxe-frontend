import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly cartService = inject(CartService);
  private readonly orderService = inject(OrderService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly cartService$ = this.cartService;
  readonly tax = computed(() => this.cartService.cartTotal() * 0.1);
  readonly grandTotal = computed(() => this.cartService.cartTotal() * 1.1);

  readonly processing = signal(false);
  readonly errorMessage = signal('');

  form!: FormGroup;

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    this.form = this.fb.group({
      name: [user?.name ?? '', Validators.required],
      email: [user?.email ?? '', [Validators.required, Validators.email]],
      phone: [user?.phone ?? '', Validators.required],
      address: [user?.address ?? '', Validators.required],
      city: [user?.city ?? '', Validators.required],
      state: [user?.state ?? '', Validators.required],
      zipCode: [user?.zipCode ?? '', Validators.required],
      paymentMethod: ['', Validators.required],
    });
  }

  placeOrder(): void {
    if (this.form.invalid || this.cartService.cartItems().length === 0) {
      this.form.markAllAsTouched();
      return;
    }

    this.processing.set(true);
    this.errorMessage.set('');

    const f = this.form.value;
    const orderData = {
      items: this.cartService.cartItems().map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      })),
      totalPrice: this.grandTotal(),
      shippingAddress: `${f.address}, ${f.city}, ${f.state} ${f.zipCode}`,
      paymentMethod: f.paymentMethod,
    };

    this.orderService.createOrder(orderData).subscribe({
      next: () => {
        this.processing.set(false);
        this.cartService.clearCart();
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.processing.set(false);
        this.errorMessage.set(err.error?.message ?? 'Failed to place order. Please try again.');
      },
    });
  }
}
