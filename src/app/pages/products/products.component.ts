import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product, CartItem } from '../../models';

interface ProductFilters {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  sortBy: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatIconModule, ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly route = inject(ActivatedRoute);

  readonly products = signal<Product[]>([]);
  readonly loading = signal(true);
  readonly totalProducts = signal(0);
  readonly currentPage = signal(1);
  readonly totalPages = signal(1);

  filters: ProductFilters = {
    search: '',
    category: '',
    minPrice: 0,
    maxPrice: 10000,
    sortBy: '',
  };

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['category']) {
        this.filters.category = params['category'];
      }
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.loading.set(true);
    this.productService
      .getProducts({ ...this.filters, page: this.currentPage(), limit: 12 })
      .subscribe({
        next: (response) => {
          this.products.set(response.products);
          this.totalProducts.set(response.pagination.total);
          this.totalPages.set(response.pagination.pages);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  applyFilters(): void {
    this.currentPage.set(1);
    this.loadProducts();
  }

  resetFilters(): void {
    this.filters = { search: '', category: '', minPrice: 0, maxPrice: 10000, sortBy: '' };
    this.currentPage.set(1);
    this.loadProducts();
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
      this.loadProducts();
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
      this.loadProducts();
    }
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
