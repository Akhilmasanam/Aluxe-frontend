export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  role: 'user' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: 'jewelry' | 'sarees' | 'clothing' | 'beauty';
  price: string | number;
  discountPrice?: string | number;
  stock: number;
  image: string;
  additionalImages?: string[];
  rating: string | number;
  reviews: number;
  isFeatured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PriceRange {
  min: string | number;
  max: string | number;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ProductListResponse {
  products: Product[];
  priceRange: PriceRange;
  pagination: Pagination;
}

export interface CartItem {
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  shippingAddress: string;
  items?: OrderItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  message: string;
  data?: T;
  errors?: any;
}
