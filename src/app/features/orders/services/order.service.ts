import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderItem } from '../../../shared/models';

const API_URL = 'http://localhost:5000/api';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);

  createOrder(data: {
    items: OrderItem[];
    totalPrice: number;
    shippingAddress: string;
    paymentMethod: string;
  }): Observable<any> {
    return this.http.post<any>(`${API_URL}/orders`, data);
  }

  getUserOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${API_URL}/orders`);
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${API_URL}/orders/${id}`);
  }

  getAllOrders(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get<any>(`${API_URL}/orders/admin/all?page=${page}&limit=${limit}`);
  }

  updateOrderStatus(
    id: string,
    status: string,
    paymentStatus?: string
  ): Observable<any> {
    return this.http.put<any>(`${API_URL}/orders/${id}/status`, {
      status,
      paymentStatus,
    });
  }
}
