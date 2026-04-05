import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpInterceptorFn,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const notificationService = inject(NotificationService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      const message = error.error?.message || 'An error occurred';

      if (error.status === 401) {
        notificationService.error('Session expired. Please login again');
        router.navigate(['/auth/login']);
      } else if (error.status === 403) {
        notificationService.error('You do not have permission to access this resource');
      } else if (error.status === 404) {
        notificationService.error('Resource not found');
      } else if (error.status >= 500) {
        notificationService.error('Server error. Please try again later');
      } else if (error.status !== 0) {
        notificationService.error(message);
      }

      return throwError(() => error);
    })
  );
};
