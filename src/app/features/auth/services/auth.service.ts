import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User, LoginResponse } from '../../../shared/models';

const API_URL = 'http://localhost:5000/api';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private readonly _currentUser = signal<User | null>(this.getStoredUser());
  private readonly _isLoading = signal(false);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly isAdmin = computed(() => this._currentUser()?.role === 'admin');
  readonly isLoggedInSignal = computed(() => !!this._currentUser());

  private getStoredUser(): User | null {
    try {
      const stored = localStorage.getItem('currentUser');
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  }

  get currentUserValue(): User | null {
    return this._currentUser();
  }

  register(
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Observable<LoginResponse> {
    this._isLoading.set(true);
    return this.http
      .post<LoginResponse>(`${API_URL}/auth/register`, {
        name,
        email,
        password,
        confirmPassword,
      })
      .pipe(
        tap((response) => {
          this.handleLogin(response);
          this._isLoading.set(false);
        })
      );
  }

  login(email: string, password: string): Observable<LoginResponse> {
    this._isLoading.set(true);
    return this.http
      .post<LoginResponse>(`${API_URL}/auth/login`, { email, password })
      .pipe(
        tap((response) => {
          this.handleLogin(response);
          this._isLoading.set(false);
        })
      );
  }

  private handleLogin(response: LoginResponse): void {
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      this._currentUser.set(response.user);
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this._currentUser.set(null);
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${API_URL}/auth/profile`);
  }

  updateProfile(data: Partial<User>): Observable<any> {
    return this.http.put<any>(`${API_URL}/auth/profile`, data);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  refreshUser(): void {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      this._currentUser.set(JSON.parse(stored) as User);
    }
  }
}
