export interface User {
  id: string;
  email: string;
  name: string;
  role: 'FARMER' | 'CUSTOMER';
  farmName?: string;
  farmAddress?: string;
  phone?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'VEGETABLES' | 'FRUITS' | 'GRAINS' | 'DAIRY';
  quantity: number;
  imageUrl?: string;
  harvestDate?: string;
  expiryDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  farmer: {
    id: string;
    name: string;
    farmName?: string;
    farmAddress?: string;
    phone?: string;
  };
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    imageUrl?: string;
    category?: string;
    farmer: {
      name: string;
      farmName?: string;
    };
  };
}

export interface Order {
  id: string;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    name: string;
    email: string;
  };
  orderItems: OrderItem[];
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  error?: string;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'FARMER' | 'CUSTOMER';
  farmName?: string;
  farmAddress?: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  category: 'VEGETABLES' | 'FRUITS' | 'GRAINS' | 'DAIRY';
  quantity: number;
  harvestDate?: string;
  expiryDate?: string;
  image?: File;
}