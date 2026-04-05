import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductListResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5000/api/products';

  constructor(private http: HttpClient) {}

  getProducts(filters?: Record<string, string | number | undefined | null>): Observable<ProductListResponse> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key];
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, String(value));
        }
      });
    }
    return this.http.get<ProductListResponse>(this.apiUrl, { params });
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/featured`);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, product);
  }

  updateProduct(id: string, product: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, product);
  }

  updateProductPartial(id: string, data: Record<string, any>): Observable<any> {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (value === undefined || value === null) {
        return;
      }

      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    });
    return this.http.put<any>(`${this.apiUrl}/${id}`, formData);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
