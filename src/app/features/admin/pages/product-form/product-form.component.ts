import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../../shared/models';
import { ProductService } from '../../../products/services/product.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CardComponent, ButtonComponent, InputComponent],
  template: `
    <section class="product-form-section">
      <div class="form-container">
        <div class="form-header">
          <button class="back-button" (click)="goBack()" aria-label="Go back">
            ← Back to Products
          </button>
          <h1>{{ isEditMode ? 'Edit Product' : 'Add New Product' }}</h1>
        </div>

        <app-card>
          <form (ngSubmit)="onSubmit()">
            <div class="form-group">
              <app-input
                label="Product Name"
                placeholder="Enter product name"
                [(ngModel)]="product.name"
                name="name"
              ></app-input>
            </div>

            <div class="form-group">
              <label>Category</label>
              <select [(ngModel)]="product.category" name="category">
                <option value="jewelry">Jewelry</option>
                <option value="sarees">Sarees</option>
                <option value="clothing">Clothing</option>
                <option value="beauty">Beauty</option>
              </select>
            </div>

            <div class="form-row">
              <div class="form-group">
                <app-input
                  label="Price (₹)"
                  type="number"
                  placeholder="0"
                  [(ngModel)]="product.price"
                  name="price"
                ></app-input>
              </div>

              <div class="form-group">
                <app-input
                  label="Stock"
                  type="number"
                  placeholder="0"
                  [(ngModel)]="product.stock"
                  name="stock"
                ></app-input>
              </div>
            </div>

            <div class="form-group">
              <app-input
                label="Product Description"
                placeholder="Enter product description"
                [(ngModel)]="product.description"
                name="description"
              ></app-input>
            </div>

            <div class="form-group">
              <label>Featured</label>
              <select [(ngModel)]="product.isFeatured" name="isFeatured">
                <option [ngValue]="true">Yes</option>
                <option [ngValue]="false">No</option>
              </select>
            </div>

            <div class="form-group">
              <label>Image</label>
              <input type="file" (change)="onImageSelected($event)" accept="image/*" />
            </div>

            <div class="form-actions">
              <app-button [variant]="'primary'" type="submit">
                {{ isEditMode ? 'Update Product' : 'Add Product' }}
              </app-button>
              <a routerLink="/admin/products">
                <app-button [variant]="'secondary'" type="button">Cancel</app-button>
              </a>
            </div>
          </form>
        </app-card>
      </div>
    </section>
  `,
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  productService = inject(ProductService);
  notificationService = inject(NotificationService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  isEditMode = false;
  productId: string | null = null;

  product: Partial<Product> = {
    name: '',
    category: 'jewelry',
    price: 0,
    stock: 0,
    description: '',
    image: '',
    rating: 0,
    reviews: 0,
    isFeatured: false,
  };
  selectedImage: File | null = null;

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = params['id'];
        this.loadProduct();
      }
    });
  }

  loadProduct() {
    if (this.productId) {
      this.productService.getProductById(this.productId).subscribe({
        next: (product) => {
          this.product = product;
        },
        error: () => {
          this.notificationService.error('Failed to load product');
        },
      });
    }
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedImage = input.files?.[0] ?? null;
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.product.name ?? '');
    formData.append('description', this.product.description ?? '');
    formData.append('category', this.product.category ?? 'jewelry');
    formData.append('price', String(this.product.price ?? 0));
    formData.append('stock', String(this.product.stock ?? 0));
    formData.append('isFeatured', String(this.product.isFeatured ?? false));

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    const request = this.isEditMode && this.productId
      ? this.productService.updateProduct(this.productId, formData)
      : this.productService.createProduct(formData);

    request.subscribe({
      next: () => {
        this.notificationService.success(`Product ${this.isEditMode ? 'updated' : 'created'} successfully`);
        this.router.navigate(['/admin/products']);
      },
      error: () => {
        this.notificationService.error('Failed to save product');
      },
    });
  }

  goBack() {
    this.router.navigate(['/admin/products']);
  }
}
