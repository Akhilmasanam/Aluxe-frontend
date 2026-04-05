import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../../cart/services/cart.service';
import { Product } from '../../../../shared/models';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  template: `
    <section class="product-details-section" *ngIf="product">
      <div class="container">
        <a routerLink="/products" class="back-link">← Back to Products</a>

        <div class="product-layout">
          <!-- Product Images -->
          <div class="product-images">
            <div class="main-image">
              <img [src]="selectedImage" [alt]="product.name" />
              <span *ngIf="product.discountPrice" class="discount-badge">
                -{{ discountPercent }}%
              </span>
            </div>
            <div class="thumbnail-gallery">
              <img
                [src]="product.image"
                [class.active]="selectedImage === product.image"
                (click)="selectedImage = product.image"
              />
              <img
                *ngFor="let img of product.additionalImages"
                [src]="img"
                [class.active]="selectedImage === img"
                (click)="selectedImage = img"
              />
            </div>
          </div>

          <!-- Product Info -->
          <div class="product-info">
            <span class="category">{{ product.category | titlecase }}</span>
            <h1>{{ product.name }}</h1>

            <div class="rating-section">
              <div class="stars">
                <span *ngFor="let star of [1,2,3,4,5]" [class.filled]="star <= product.rating">★</span>
              </div>
              <span class="rating-text">{{ product.rating }} ({{ product.reviews }} reviews)</span>
            </div>

            <div class="price-section">
              <div class="price-display">
                <span *ngIf="product.discountPrice" class="original-price">
                  ₹{{ product.price }}
                </span>
                <span class="current-price">
                  ₹{{ product.discountPrice || product.price }}
                </span>
              </div>
              <div class="stock-status" [class]="product.stock > 0 ? 'in-stock' : 'out-stock'">
                {{ product.stock > 0 ? 'In Stock' : 'Out of Stock' }}
              </div>
            </div>

            <div class="description">
              <h3>Description</h3>
              <p>{{ product.description }}</p>
            </div>

            <div class="quantity-selector">
              <label>Quantity:</label>
              <div class="quantity-control">
                <button (click)="decreaseQuantity()" [disabled]="quantity <= 1">−</button>
                <span>{{ quantity }}</span>
                <button (click)="increaseQuantity()" [disabled]="quantity >= product.stock">+</button>
              </div>
            </div>

            <div class="product-actions">
              <app-button
                variant="primary"
                size="lg"
                [fullWidth]="true"
                (click)="addToCart()"
                [disabled]="product.stock === 0"
              >
                Add to Cart
              </app-button>
              <button class="wishlist-btn" title="Add to wishlist">
                ♡ Add to Wishlist
              </button>
            </div>

            <div class="product-meta">
              <div class="meta-item">
                <span class="meta-label">Category:</span>
                <span>{{ product.category | titlecase }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Product ID:</span>
                <span>{{ product.id }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div *ngIf="!product" class="loading">Loading product details...</div>
  `,
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  productService = inject(ProductService);
  cartService = inject(CartService);
  notificationService = inject(NotificationService);
  route = inject(ActivatedRoute);

  product: Product | null = null;
  selectedImage = '';
  quantity = 1;

  get discountPercent(): number {
    if (!this.product?.discountPrice) return 0;
    return Math.round(
      ((this.product.price - this.product.discountPrice) / this.product.price) * 100
    );
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.loadProduct(params['id']);
    });
  }

  loadProduct(id: string) {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.selectedImage = product.image;
      },
      error: () => {
        this.notificationService.error('Failed to load product');
      },
    });
  }

  increaseQuantity() {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
      this.notificationService.success(`Added ${this.quantity} item(s) to cart!`);
      this.quantity = 1;
    }
  }
}
