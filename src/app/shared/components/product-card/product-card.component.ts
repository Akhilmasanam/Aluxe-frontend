import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  template: `
    <div class="product-card">
      <div class="product-image">
        <img [src]="product.image" [alt]="product.name" />
        <span *ngIf="product.discountPrice" class="discount-badge">
          -{{ discountPercent }}%
        </span>
      </div>

      <div class="product-body">
        <span class="category">{{ product.category }}</span>
        <h3 [routerLink]="['/product', product.id]" class="product-name">
          {{ product.name }}
        </h3>

        <div class="product-rating">
          <div class="stars">
            <span *ngFor="let star of [1,2,3,4,5]" [class.filled]="star <= product.rating">★</span>
          </div>
          <span class="reviews">({{ product.reviews }})</span>
        </div>

        <div class="product-price">
          <span *ngIf="product.discountPrice" class="original-price">
            ₹{{ product.price }}
          </span>
          <span class="current-price">
            ₹{{ product.discountPrice || product.price }}
          </span>
        </div>

        <div class="product-stock">
          <span [class]="product.stock > 0 ? 'in-stock' : 'out-stock'">
            {{ product.stock > 0 ? 'In Stock' : 'Out of Stock' }}
          </span>
        </div>
      </div>

      <div class="product-actions">
        <app-button
          variant="primary"
          size="sm"
          [fullWidth]="true"
          (click)="addToCart()"
          [disabled]="product.stock === 0"
        >
          Add to Cart
        </app-button>
        <a [routerLink]="['/product', product.id]" class="view-details">
          View Details
        </a>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      overflow: hidden;
      transition: all 300ms ease-out;
      display: flex;
      flex-direction: column;
      height: 100%;

      &:hover {
        border-color: #ffd764;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        transform: translateY(-8px);

        .product-image img {
          transform: scale(1.05);
        }
      }
    }

    .product-image {
      position: relative;
      overflow: hidden;
      padding-bottom: 100%;
      background: #f5f5f5;

      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 300ms ease-out;
      }
    }

    .discount-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: linear-gradient(135deg, #ffd764 0%, #d4a51e 100%);
      color: #1f1f1f;
      padding: 0.5rem 0.75rem;
      border-radius: 8px;
      font-weight: 700;
      font-size: 0.85rem;
    }

    .product-body {
      padding: 1rem;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .category {
      display: inline-block;
      background: #fafafa;
      color: #666;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: capitalize;
      width: fit-content;
    }

    .product-name {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: #1f1f1f;
      line-height: 1.4;
      min-height: 2.8em;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      cursor: pointer;
      transition: color 200ms ease-out;

      &:hover {
        color: #ffd764;
      }
    }

    .product-rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .stars {
      display: flex;
      gap: 0.25rem;
      font-size: 0.85rem;

      span {
        color: #ddd;

        &.filled {
          color: #ffd764;
        }
      }
    }

    .reviews {
      color: #999;
      font-size: 0.85rem;
    }

    .product-price {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
    }

    .original-price {
      color: #999;
      text-decoration: line-through;
      font-size: 0.9rem;
    }

    .current-price {
      font-size: 1.2rem;
      font-weight: 700;
      color: #1f1f1f;
    }

    .product-stock {
      margin-top: auto;

      span {
        font-size: 0.9rem;
        font-weight: 600;

        &.in-stock {
          color: #4caf50;
        }

        &.out-stock {
          color: #f44336;
        }
      }
    }

    .product-actions {
      padding: 1rem;
      background: #fafafa;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .view-details {
      text-align: center;
      color: #ffd764;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      padding: 0.5rem;
      transition: color 200ms ease-out;

      &:hover {
        color: #d4a51e;
      }
    }
  `],
})
export class ProductCardComponent {
  @Input() product!: Product;

  get discountPercent(): number {
    if (!this.product.discountPrice) return 0;
    return Math.round(((this.product.price - this.product.discountPrice) / this.product.price) * 100);
  }

  addToCart() {
    // Will be handled by parent component
  }
}
