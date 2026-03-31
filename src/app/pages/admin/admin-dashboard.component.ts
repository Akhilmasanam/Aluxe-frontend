import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DatePipe, SlicePipe } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { Order, Product } from '../../models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    MatTabsModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    DatePipe,
    SlicePipe,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly orderService = inject(OrderService);

  readonly products = signal<Product[]>([]);
  readonly orders = signal<Order[]>([]);
  readonly showProductForm = signal(false);
  readonly editingProduct = signal<Product | null>(null);
  readonly selectedImage = signal<File | null>(null);

  readonly productColumns = ['name', 'category', 'price', 'stock', 'action'];
  readonly orderColumns = ['id', 'total', 'status', 'paymentStatus', 'date'];

  productForm = {
    name: '',
    category: '' as Product['category'] | '',
    price: 0,
    discountPrice: 0,
    stock: 0,
    description: '',
    isFeatured: false,
  };

  ngOnInit(): void {
    this.loadProducts();
    this.loadOrders();
  }

  loadProducts(): void {
    this.productService.getProducts({ limit: 100 }).subscribe({
      next: (res) => this.products.set(res.products),
      error: (e) => console.error('Error loading products:', e),
    });
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (res) => this.orders.set(res.orders),
      error: (e) => console.error('Error loading orders:', e),
    });
  }

  toggleProductForm(): void {
    this.showProductForm.update((v) => !v);
    if (!this.showProductForm()) this.resetProductForm();
  }

  resetProductForm(): void {
    this.productForm = {
      name: '',
      category: '',
      price: 0,
      discountPrice: 0,
      stock: 0,
      description: '',
      isFeatured: false,
    };
    this.editingProduct.set(null);
    this.selectedImage.set(null);
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedImage.set(input.files?.[0] ?? null);
  }

  editProduct(product: Product): void {
    this.editingProduct.set(product);
    this.productForm = {
      name: product.name,
      category: product.category,
      price: product.price,
      discountPrice: product.discountPrice ?? 0,
      stock: product.stock,
      description: product.description,
      isFeatured: product.isFeatured,
    };
    this.showProductForm.set(true);
  }

  saveProduct(): void {
    console.log('Saving product:', this.productForm);
  }

  deleteProduct(id: string): void {
    if (!confirm('Are you sure you want to delete this product?')) return;
    this.productService.deleteProduct(id).subscribe({
      next: () => this.loadProducts(),
      error: (e) => console.error('Error deleting product:', e),
    });
  }

  updateOrderStatus(order: Order): void {
    this.orderService.updateOrderStatus(order.id, order.status).subscribe({
      next: () => console.log('Order status updated'),
      error: (e) => console.error('Error updating order:', e),
    });
  }
}
