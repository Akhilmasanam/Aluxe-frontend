import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationService } from '../../../core/services/notification.service';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const API_URL = 'http://localhost:5000/api';

export interface RazorpayOrderResponse {
  orderId: string;
  razorpayOrderId?: string;
  currency: string;
  amount: number;
}

export interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);

  createRazorpayOrder(orderData: {
    orderId: string;
    amount: number;
    customerEmail: string;
    customerName: string;
  }): Observable<RazorpayOrderResponse> {
    return this.http.post<RazorpayOrderResponse>(`${API_URL}/payment/create-order`, orderData);
  }

  verifyPayment(paymentData: {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }): Observable<any> {
    return this.http.post<any>(`${API_URL}/payment/verify`, paymentData);
  }

  openRazorpayCheckout(options: {
    key: string;
    amount: number;
    currency: string;
    order_id: string;
    name: string;
    description: string;
    customer_name: string;
    customer_email: string;
    onSuccess: (response: RazorpaySuccessResponse) => void;
    onError: (error: any) => void;
  }): void {
    if (!window.Razorpay) {
      this.notificationService.error('Payment system not available');
      return;
    }

    const razorpay = new window.Razorpay({
      key: options.key,
      amount: options.amount,
      currency: options.currency,
      name: options.name,
      description: options.description,
      order_id: options.order_id,
      prefill: {
        name: options.customer_name,
        email: options.customer_email,
      },
      handler: (response: RazorpaySuccessResponse) => {
        options.onSuccess(response);
      },
      modal: {
        ondismiss: () => {
          options.onError({ error: 'Payment cancelled by user' });
        },
      },
    });

    razorpay.open();
  }
}
