import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductListResponse } from '../../../shared/models';

const API_URL = 'http://localhost:5000/api';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);

  getProducts(filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  }): Observable<ProductListResponse> {
    const params = new URLSearchParams();

    if (filters?.category) params.set('category', filters.category);
    if (filters?.minPrice !== undefined) params.set('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice !== undefined) params.set('maxPrice', filters.maxPrice.toString());
    if (filters?.search) params.set('search', filters.search);
    if (filters?.sortBy) params.set('sortBy', filters.sortBy);
    if (filters?.page) params.set('page', filters.page.toString());
    if (filters?.limit) params.set('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = queryString ? `${API_URL}/products?${queryString}` : `${API_URL}/products`;

    return this.http.get<ProductListResponse>(url);
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${API_URL}/products/featured`);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${API_URL}/products/${id}`);
  }

  createProduct(formData: FormData): Observable<any> {
    return this.http.post<any>(`${API_URL}/products`, formData);
  }

  updateProduct(id: string, formData: FormData): Observable<any> {
    return this.http.put<any>(`${API_URL}/products/${id}`, formData);
  }
  updateProductPartial(id: string, data: Record<string, any>): Observable<any> {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    return this.http.put<any>(`${API_URL}/products/${id}`, formData);
  }
  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${API_URL}/products/${id}`);
  }
}
