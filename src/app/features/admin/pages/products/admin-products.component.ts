import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, NavigationEnd, Router } from '@angular/router';
import { Product } from '../../../../shared/models';
import { ProductService } from '../../../products/services/product.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CardComponent, ButtonComponent],
  template: `
    <section class="admin-products-section">
      <div class="header-section">
        <h1>Products Management</h1>
        <div style="display: flex; gap: 10px;">
          <a routerLink="/admin/products/new">
            <app-button variant="primary">+ Add New Product</app-button>
          </a>
          <app-button variant="secondary" (click)="loadProducts()">🔄 Refresh</app-button>
        </div>
      </div>

      <!-- Search & Filter -->
      <app-card class="search-section">
        <div class="filter-controls">
          <input
            type="text"
            placeholder="Search products..."
            [(ngModel)]="searchTerm"
            (ngModelChange)="onSearch()"
          />
          <select [(ngModel)]="filterCategory" (change)="onFilterChange()">
            <option value="">All Categories</option>
            <option value="jewelry">Jewelry</option>
            <option value="sarees">Sarees</option>
            <option value="clothing">Clothing</option>
            <option value="beauty">Beauty</option>
          </select>
        </div>
      </app-card>

      <!-- Products Table -->
      <app-card>
        <table class="products-table" *ngIf="filteredProducts.length > 0; else noProducts">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Featured</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let product of filteredProducts">
              <td>
                <img [src]="product.image" [alt]="product.name" class="product-image" />
              </td>
              <td>{{ product.name }}</td>
              <td>{{ product.category | titlecase }}</td>
              <td>₹{{ product.price }}</td>
              <td>
                <button class="feature-btn" (click)="toggleFeatured(product)">
                  {{ product.isFeatured ? 'Featured' : 'No' }}
                </button>
              </td>
              <td>
                <span class="stock-badge" [class.low]="product.stock < 10">
                  {{ product.stock }}
                </span>
              </td>
              <td>
                <span class="status-badge" [class.active]="!product.archived">
                  {{ product.archived ? 'Archived' : 'Active' }}
                </span>
              </td>
              <td class="actions-cell">
                <a [routerLink]="['/admin/products', product.id, 'edit']">
                  <button class="edit-btn">✏️ Edit</button>
                </a>
                <button (click)="deleteProduct(product.id)" class="delete-btn">🗑️ Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        <ng-template #noProducts>
          <p style="text-align: center; color: #999; padding: 2rem;">No products found</p>
        </ng-template>
      </app-card>
    </section>
  `,
  styleUrls: ['./admin-products.component.scss'],
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  productService = inject(ProductService);
  notificationService = inject(NotificationService);
  router = inject(Router);

  private readonly destroy$ = new Subject<void>();

  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm = '';
  filterCategory = '';

  ngOnInit() {
    this.loadProducts();

    // Reload products when navigating back to this route
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd && event.url.includes('/admin/products') && !event.url.includes('/edit') && !event.url.includes('/new')),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        console.log('Reloading products list');
        this.loadProducts();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts() {
    console.log('🔄 Loading products from AdminProductsComponent...');
    this.productService.getProducts({ limit: 100 }).subscribe({
      next: (response) => {
        console.log('✓ Products loaded successfully:', response);
        console.log('Products array:', response.products);
        this.products = Array.isArray(response.products) ? response.products : [];
        this.applyFilters();
        console.log('Filtered products:', this.filteredProducts);
      },
      error: (err) => {
        console.error('✗ Error loading products:', err);
        this.notificationService.error('Failed to load products. Please try refreshing the page.');
        this.products = [];
        this.filteredProducts = [];
      },
    });
  }

  onSearch() {
    this.applyFilters();
  }

  toggleFeatured(product: Product) {
    this.productService.updateProductPartial(product.id, { isFeatured: !product.isFeatured }).subscribe({
      next: () => {
        this.notificationService.success(`Product ${product.isFeatured ? 'removed from' : 'marked as'} featured`);
        this.loadProducts();
      },
      error: () => {
        this.notificationService.error('Failed to update featured status');
      },
    });
  }

  onFilterChange() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredProducts = this.products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = !this.filterCategory || p.category === this.filterCategory;
      return matchesSearch && matchesCategory;
    });
  }

  deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.notificationService.success('Product deleted');
          this.loadProducts();
        },
        error: () => {
          this.notificationService.error('Failed to delete product');
        },
      });
    }
  }
}
