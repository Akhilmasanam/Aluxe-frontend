import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { ProductService } from '../products/services/product.service';
import { CartService } from '../cart/services/cart.service';
import { Product } from '../../shared/models';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { NotificationService } from '../../core/services/notification.service';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent, ButtonComponent],
  template: `
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">ALUXE</h1>
        <p class="hero-subtitle">Premium Fashion & Jewelry for the Modern Woman</p>
        <p class="hero-description">Discover our collection of exquisite jewelry, elegant sarees, trendy clothing, and beauty products</p>
        <a routerLink="/products" class="cta-button">
          <app-button variant="primary" size="lg">
            Explore Collection
          </app-button>
        </a>
      </div>
      <div class="hero-image">
        <div class="hero-placeholder">
          <span>✨ Featured Collection ✨</span>
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="featured-section">
      <div class="container">
        <div class="section-header">
          <h2>Featured Products</h2>
          <p>Handpicked luxury items</p>
        </div>

        <div class="products-grid" *ngIf="featuredProducts && featuredProducts.length > 0; else noProducts">
          <app-product-card
            *ngFor="let product of featuredProducts"
            [product]="product"
            (click)="addToCart(product)"
          ></app-product-card>
        </div>

        <ng-template #noProducts>
          <div class="no-products">
            <p>No featured products available</p>
          </div>
        </ng-template>

        <div class="section-footer">
          <a routerLink="/products" class="view-all">
            View All Products →
          </a>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="categories-section">
      <div class="container">
        <h2>Shop by Category</h2>
        <div class="categories-grid">
          <a routerLink="/products" [queryParams]="{ category: 'jewelry' }" class="category-card">
            <div class="category-icon">💎</div>
            <h3>Jewelry</h3>
            <p>Precious & Semi-precious</p>
          </a>
          <a routerLink="/products" [queryParams]="{ category: 'sarees' }" class="category-card">
            <div class="category-icon">👗</div>
            <h3>Sarees</h3>
            <p>Traditional & Modern</p>
          </a>
          <a routerLink="/products" [queryParams]="{ category: 'clothing' }" class="category-card">
            <div class="category-icon">👔</div>
            <h3>Clothing</h3>
            <p>Fashion Essentials</p>
          </a>
          <a routerLink="/products" [queryParams]="{ category: 'beauty' }" class="category-card">
            <div class="category-icon">💄</div>
            <h3>Beauty</h3>
            <p>Premium Products</p>
          </a>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🚚</div>
            <h3>Free Shipping</h3>
            <p>Complimentary shipping on orders over ₹500</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔒</div>
            <h3>Secure Checkout</h3>
            <p>Safe and encrypted payment processing</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">↩️</div>
            <h3>Easy Returns</h3>
            <p>30-day hassle-free return policy</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">⭐</div>
            <h3>Quality Assured</h3>
            <p>Premium products with authenticity guarantee</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  productService = inject(ProductService);
  cartService = inject(CartService);
  notificationService = inject(NotificationService);
  router = inject(Router);

  private readonly destroy$ = new Subject<void>();

  featuredProducts: Product[] = [];

  ngOnInit() {
    this.loadFeaturedProducts();

    // Reload featured products when navigating back to home
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd && event.url === '/'),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        console.log('Reloading featured products');
        this.loadFeaturedProducts();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadFeaturedProducts() {
    this.productService.getFeaturedProducts().subscribe({
      next: (products) => {
        console.log('✓ Featured products loaded:', products.length, 'products');
        this.featuredProducts = Array.isArray(products) ? products.slice(0, 8) : [];
      },
      error: (error) => {
        console.error('✗ Error loading featured products:', error);
        this.notificationService.error('Failed to load featured products');
        this.featuredProducts = [];
      },
    });
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product, 1);
    this.notificationService.success(`${product.name} added to cart!`);
  }
}
