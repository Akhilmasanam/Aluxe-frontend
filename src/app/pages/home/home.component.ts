import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product, CartItem } from '../../models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, MatButtonModule, MatIconModule, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);

  readonly featuredProducts = signal<Product[]>([]);
  readonly loading = signal(true);

  readonly categories = [
    { slug: 'jewelry', label: 'Jewelry', icon: '💎', desc: 'Elegant & Timeless' },
    { slug: 'sarees', label: 'Sarees', icon: '👗', desc: 'Traditional & Modern' },
    { slug: 'clothing', label: 'Clothing', icon: '👔', desc: 'Stylish Collection' },
    { slug: 'beauty', label: 'Beauty', icon: '💄', desc: 'Premium Products' },
  ];

  ngOnInit(): void {
    this.productService.getFeaturedProducts().subscribe({
      next: (products) => {
        this.featuredProducts.set(products);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  addToCart(product: Product): void {
    const item: CartItem = {
      productId: product.id,
      product,
      quantity: 1,
      price: product.discountPrice ?? product.price,
    };
    this.cartService.addToCart(item);
  }
}
