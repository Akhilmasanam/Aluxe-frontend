import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../../../shared/models';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { CartService } from '../../../cart/services/cart.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent, CardComponent],
  template: `
    <section class="products-section">
      <div class="container">
        <!-- Header -->
        <div class="section-header">
          <h1>Our Collection</h1>
          <p>Handpicked luxury items for the modern woman</p>
        </div>

        <div class="products-layout">
          <!-- Filters Sidebar -->
          <aside class="filters-sidebar">
            <app-card>
              <div class="filters-content">
                <h3>Filters</h3>

                <!-- Category Filter -->
                <div class="filter-group">
                  <h4>Category</h4>
                  <label>
                    <input
                      type="radio"
                      name="category"
                      value=""
                      [(ngModel)]="selectedCategory"
                      (change)="applyFilters()"
                    />
                    <span>All</span>
                  </label>
                  <label *ngFor="let cat of categories">
                    <input
                      type="radio"
                      name="category"
                      [value]="cat"
                      [(ngModel)]="selectedCategory"
                      (change)="applyFilters()"
                    />
                    <span>{{ cat | titlecase }}</span>
                  </label>
                </div>

                <!-- Price Filter -->
                <div class="filter-group">
                  <h4>Price Range</h4>
                  <div class="price-inputs">
                    <input
                      type="number"
                      placeholder="Min"
                      [(ngModel)]="minPrice"
                      (change)="applyFilters()"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      [(ngModel)]="maxPrice"
                      (change)="applyFilters()"
                    />
                  </div>
                </div>

                <!-- Search -->
                <div class="filter-group">
                  <h4>Search</h4>
                  <input
                    type="text"
                    placeholder="Search products..."
                    [(ngModel)]="searchQuery"
                    (keyup.debounce)="applyFilters()"
                  />
                </div>

                <!-- Sort -->
                <div class="filter-group">
                  <h4>Sort By</h4>
                  <select [(ngModel)]="sortBy" (change)="applyFilters()">
                    <option value="">Latest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                <button class="reset-filters" (click)="resetFilters()">Reset Filters</button>
              </div>
            </app-card>
          </aside>

          <!-- Products Grid -->
          <main class="products-main">
            <div class="products-header">
              <p class="product-count">
                Showing {{ products.length }} products
              </p>
            </div>

            <div class="products-grid">
              <app-product-card
                *ngFor="let product of products"
                [product]="product"
                (click)="addToCart(product)"
              ></app-product-card>
            </div>

            <div *ngIf="products.length === 0" class="no-products">
              <p>No products found matching your criteria</p>
            </div>

            <!-- Pagination -->
            <div class="pagination" *ngIf="totalPages > 1">
              <button
                *ngFor="let page of getPageNumbers()"
                [class.active]="page === currentPage"
                (click)="goToPage(page)"
              >
                {{ page }}
              </button>
            </div>
          </main>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit, OnDestroy {
  productService = inject(ProductService);
  cartService = inject(CartService);
  notificationService = inject(NotificationService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  private readonly destroy$ = new Subject<void>();

  products: Product[] = [];
  categories = ['jewelry', 'sarees', 'clothing', 'beauty'];
  selectedCategory = '';
  minPrice = 0;
  maxPrice = 10000;
  searchQuery = '';
  sortBy = '';
  currentPage = 1;
  limit = 12;
  totalPages = 1;

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['category']) {
        this.selectedCategory = params['category'];
      }
      this.applyFilters();
    });

    // Reload products when navigating back to this route
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd && event.url.startsWith('/products')),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        console.log('Reloading products list');
        this.applyFilters();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  applyFilters() {
    this.currentPage = 1;
    console.log('🔍 Applying filters:', {
      category: this.selectedCategory,
      search: this.searchQuery,
      sortBy: this.sortBy
    });

    this.productService
      .getProducts({
        category: this.selectedCategory,
        minPrice: this.minPrice,
        maxPrice: this.maxPrice,
        search: this.searchQuery,
        sortBy: this.sortBy,
        page: this.currentPage,
        limit: this.limit,
      })
      .subscribe({
        next: (response) => {
          console.log('✓ Products API response:', response);
          console.log('✓ Products loaded successfully:', response.products?.length || 0, 'products');
          console.log('✓ Sample products:', response.products?.slice(0, 2));

          this.products = Array.isArray(response.products) ? response.products : [];
          this.totalPages = response.pagination?.pages || 1;

          console.log('✓ Final products array length:', this.products.length);
        },
        error: (err) => {
          console.error('✗ Error loading products:', err);
          this.notificationService.error('Failed to load products. Please try refreshing the page.');
          this.products = [];
          this.totalPages = 1;
        },
      });
  }

  resetFilters() {
    this.selectedCategory = '';
    this.minPrice = 0;
    this.maxPrice = 10000;
    this.searchQuery = '';
    this.sortBy = '';
    this.applyFilters();
  }

  goToPage(page: number) {
    this.currentPage = page;
    window.scrollTo(0, 0);
    this.applyFilters();
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product, 1);
    this.notificationService.success(`${product.name} added to cart!`);
  }
}
