import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderItem } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:5000/api/orders';

  constructor(private http: HttpClient) {}

  createOrder(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  getUserOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  getAllOrders(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/all?page=${page}&limit=${limit}`);
  }

  updateOrderStatus(id: string, status: string, paymentStatus?: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/status`, { status, paymentStatus });
  }
}
