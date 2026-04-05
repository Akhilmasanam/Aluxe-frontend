import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product, CartItem, PriceRange } from '../../models';

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
  readonly availableMinPrice = signal(0);
  readonly availableMaxPrice = signal(0);

  private hasActivePriceFilter = false;

  filters: ProductFilters = {
    search: '',
    category: '',
    minPrice: 0,
    maxPrice: 0,
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
    const requestFilters: Record<string, string | number> = {
      search: this.filters.search,
      category: this.filters.category,
      sortBy: this.filters.sortBy,
      page: this.currentPage(),
      limit: 12,
    };

    if (this.hasActivePriceFilter) {
      requestFilters['minPrice'] = this.filters.minPrice;
      requestFilters['maxPrice'] = this.filters.maxPrice;
    }

    this.productService
      .getProducts(requestFilters)
      .subscribe({
        next: (response) => {
          const priceFilterAdjusted = this.syncPriceRange(response.priceRange);
          if (priceFilterAdjusted) {
            this.loadProducts();
            return;
          }

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

  selectCategory(category: string): void {
    this.filters.category = category;
    this.applyFilters();
  }

  onMinPriceChange(value: number | string): void {
    const nextValue = Number(value);
    this.hasActivePriceFilter = true;
    this.filters.minPrice = Math.min(nextValue, this.filters.maxPrice);
    this.applyFilters();
  }

  onMaxPriceChange(value: number | string): void {
    const nextValue = Number(value);
    this.hasActivePriceFilter = true;
    this.filters.maxPrice = Math.max(nextValue, this.filters.minPrice);
    this.applyFilters();
  }

  resetFilters(): void {
    this.hasActivePriceFilter = false;
    this.filters = {
      search: '',
      category: '',
      minPrice: this.availableMinPrice(),
      maxPrice: this.availableMaxPrice(),
      sortBy: '',
    };
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

  private syncPriceRange(priceRange: PriceRange): boolean {
    const min = Math.floor(priceRange.min ?? 0);
    const max = Math.ceil(priceRange.max ?? min);

    this.availableMinPrice.set(min);
    this.availableMaxPrice.set(max);

    if (!this.hasActivePriceFilter) {
      this.filters.minPrice = min;
      this.filters.maxPrice = max;
      return false;
    }

    const nextMinPrice = Math.max(min, Math.min(this.filters.minPrice, max));
    const nextMaxPrice = Math.max(nextMinPrice, Math.min(this.filters.maxPrice, max));
    const adjusted = nextMinPrice !== this.filters.minPrice || nextMaxPrice !== this.filters.maxPrice;

    this.filters.minPrice = nextMinPrice;
    this.filters.maxPrice = nextMaxPrice;

    return adjusted;
  }
}
