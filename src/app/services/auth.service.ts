import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, LoginResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:5000/api/auth';

  // Signals-based state
  private readonly _currentUser = signal<User | null>(this.getStoredUser());

  // Public readonly signals
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAdmin = computed(() => this._currentUser()?.role === 'admin');

  constructor(private http: HttpClient) {}

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
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/register`, { name, email, password, confirmPassword })
      .pipe(tap((response) => this.handleLogin(response)));
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(tap((response) => this.handleLogin(response)));
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
    return this.http.get<User>(`${this.apiUrl}/profile`);
  }

  updateProfile(data: Partial<User>): Observable<unknown> {
    return this.http.put<unknown>(`${this.apiUrl}/profile`, data);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
