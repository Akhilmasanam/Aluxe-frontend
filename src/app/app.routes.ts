import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home.component').then((m) => m.HomeComponent),
        data: { title: 'Home — ALUXE' },
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/products/pages/products-list/products-list.component').then(
            (m) => m.ProductsListComponent
          ),
        data: { title: 'Products — ALUXE' },
      },
      {
        path: 'product/:id',
        loadComponent: () =>
          import('./features/products/pages/product-details/product-details.component').then(
            (m) => m.ProductDetailsComponent
          ),
        data: { title: 'Product Details — ALUXE' },
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('./features/cart/pages/cart/cart.component').then(
            (m) => m.CartComponent
          ),
        data: { title: 'Shopping Cart — ALUXE' },
      },
      {
        path: 'checkout',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/cart/pages/checkout/checkout.component').then(
            (m) => m.CheckoutComponent
          ),
        data: { title: 'Checkout — ALUXE' },
      },
      {
        path: 'orders',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/orders/pages/order-history/order-history.component').then(
            (m) => m.OrderHistoryComponent
          ),
        data: { title: 'My Orders — ALUXE' },
      },
      {
        path: 'orders/:id',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/orders/pages/order-detail/order-detail.component').then(
            (m) => m.OrderDetailComponent
          ),
        data: { title: 'Order Details — ALUXE' },
      },
    ],
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./features/auth/auth-layout/auth-layout.component').then(
        (m) => m.AuthLayoutComponent
      ),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/pages/login/login.component').then(
            (m) => m.LoginComponent
          ),
        data: { title: 'Login — ALUXE' },
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/pages/register/register.component').then(
            (m) => m.RegisterComponent
          ),
        data: { title: 'Register — ALUXE' },
      },
    ],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/pages/dashboard/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/admin/pages/products/admin-products.component').then(
            (m) => m.AdminProductsComponent
          ),
      },
      {
        path: 'products/create',
        loadComponent: () =>
          import('./features/admin/pages/product-form/product-form.component').then(
            (m) => m.ProductFormComponent
          ),
      },
      {
        path: 'products/new',
        loadComponent: () =>
          import('./features/admin/pages/product-form/product-form.component').then(
            (m) => m.ProductFormComponent
          ),
      },
      {
        path: 'products/:id/edit',
        loadComponent: () =>
          import('./features/admin/pages/product-form/product-form.component').then(
            (m) => m.ProductFormComponent
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/admin/pages/orders/admin-orders.component').then(
            (m) => m.AdminOrdersComponent
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/admin/pages/users/admin-users.component').then(
            (m) => m.AdminUsersComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
