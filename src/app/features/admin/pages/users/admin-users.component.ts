import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../shared/models';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { NotificationService } from '../../../../core/services/notification.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent],
  template: `
    <section class="admin-users-section">
      <div class="header-section">
        <div>
          <h1>Users Management</h1>
          <p class="subtitle">Search, filter, block/unblock, add, and delete users.</p>
        </div>
        <button class="toggle-form-btn" (click)="toggleCreateForm()">
          {{ showCreateForm ? 'Hide Add User' : '+ Add New User' }}
        </button>
      </div>

      <div *ngIf="showCreateForm" class="create-user-card">
        <app-card>
          <div class="create-form">
            <div class="form-field">
              <label>Name</label>
              <input type="text" [(ngModel)]="newUser.name" placeholder="Full name" />
            </div>
            <div class="form-field">
              <label>Email</label>
              <input type="email" [(ngModel)]="newUser.email" placeholder="Email address" />
            </div>
            <div class="form-field">
              <label>Password</label>
              <input type="password" [(ngModel)]="newUser.password" placeholder="Password" />
            </div>
            <div class="form-field">
              <label>Role</label>
              <select [(ngModel)]="newUser.role">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div class="form-field checkbox-field">
              <label>
                <input type="checkbox" [(ngModel)]="newUser.isBlocked" />
                Blocked
              </label>
            </div>
            <div class="form-actions">
              <button class="save-btn" (click)="createUser()">Create User</button>
            </div>
          </div>
        </app-card>
      </div>

      <app-card class="filter-card">
        <div class="filter-row">
          <input
            type="text"
            placeholder="Search by name or email..."
            [(ngModel)]="searchTerm"
            (input)="loadUsers()"
          />
          <select [(ngModel)]="filterRole" (change)="loadUsers()">
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <select [(ngModel)]="filterStatus" (change)="loadUsers()">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </app-card>

      <app-card>
        <table class="users-table" *ngIf="users.length > 0; else noUsers">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users">
              <td>{{ user.id | slice:0:8 }}...</td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>
                <span class="role-badge" [class.admin]="user.role === 'admin'">
                  {{ user.role }}
                </span>
              </td>
              <td>
                <span class="status-badge" [class.blocked]="user.isBlocked">
                  {{ user.isBlocked ? 'Blocked' : 'Active' }}
                </span>
              </td>
              <td class="actions-cell">
                <button class="block-btn" (click)="toggleBlockUser(user)">
                  {{ user.isBlocked ? 'Unblock' : 'Block' }}
                </button>
                <button class="delete-btn" (click)="deleteUser(user.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        <ng-template #noUsers>
          <p style="text-align: center; color: #999; padding: 2rem;">No users found</p>
        </ng-template>
      </app-card>
    </section>
  `,
  styleUrls: ['./admin-users.component.scss'],
})
export class AdminUsersComponent implements OnInit {
  userService = inject(UserService);
  notificationService = inject(NotificationService);

  users: User[] = [];
  searchTerm = '';
  filterRole = '';
  filterStatus = '';
  showCreateForm = false;

  newUser: Partial<User> & { password: string } = {
    name: '',
    email: '',
    password: '',
    role: 'user',
    isBlocked: false,
  };

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService
      .getUsers({
        search: this.searchTerm,
        role: this.filterRole,
        status: this.filterStatus,
      })
      .subscribe({
        next: (response) => {
          this.users = response.users;
        },
        error: () => {
          this.notificationService.error('Failed to load users');
        },
      });
  }

  toggleCreateForm() {
    this.showCreateForm = !this.showCreateForm;
  }

  createUser() {
    if (!this.newUser.name || !this.newUser.email || !this.newUser.password) {
      this.notificationService.error('Please fill all required fields');
      return;
    }

    this.userService
      .createUser({
        name: this.newUser.name,
        email: this.newUser.email,
        password: this.newUser.password,
        role: this.newUser.role || 'user',
        isBlocked: this.newUser.isBlocked ?? false,
      })
      .subscribe({
        next: () => {
          this.notificationService.success('User created successfully');
          this.resetNewUser();
          this.showCreateForm = false;
          this.loadUsers();
        },
        error: (error) => {
          this.notificationService.error(error.error?.message || 'Failed to create user');
        },
      });
  }

  resetNewUser() {
    this.newUser = {
      name: '',
      email: '',
      password: '',
      role: 'user',
      isBlocked: false,
    };
  }

  toggleBlockUser(user: User) {
    this.userService.updateUser(user.id, { isBlocked: !user.isBlocked }).subscribe({
      next: () => {
        this.notificationService.success(`User ${user.isBlocked ? 'unblocked' : 'blocked'} successfully`);
        this.loadUsers();
      },
      error: () => {
        this.notificationService.error('Failed to update user status');
      },
    });
  }

  deleteUser(userId: string) {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.notificationService.success('User deleted successfully');
        this.loadUsers();
      },
      error: () => {
        this.notificationService.error('Failed to delete user');
      },
    });
  }
}
