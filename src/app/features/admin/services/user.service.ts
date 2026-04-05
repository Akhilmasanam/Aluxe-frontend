import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../../shared/models';

const API_URL = 'http://localhost:5000/api/users';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  getUsers(filters?: { search?: string; role?: string; status?: string }): Observable<{ users: User[] }> {
    let params = new HttpParams();

    if (filters) {
      if (filters.search) {
        params = params.set('search', filters.search);
      }
      if (filters.role) {
        params = params.set('role', filters.role);
      }
      if (filters.status) {
        params = params.set('status', filters.status);
      }
    }

    return this.http.get<{ users: User[] }>(`${API_URL}/admin/all`, { params });
  }

  createUser(data: { name: string; email: string; password: string; role: string; isBlocked: boolean }): Observable<any> {
    return this.http.post<any>(API_URL, data);
  }

  updateUser(id: string, data: Partial<User> & { password?: string; isBlocked?: boolean }): Observable<any> {
    return this.http.put<any>(`${API_URL}/${id}`, data);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${API_URL}/${id}`);
  }
}
