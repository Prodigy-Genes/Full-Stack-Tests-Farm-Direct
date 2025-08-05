import axios from 'axios';
import type { 
  AuthResponse, 
  RegisterData, 
  LoginData, 
  User, 
  Product, 
  ProductsResponse,
  CreateProductData,
  Order,
  CartItem
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  getProfile: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<{ user: User }> => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },
};

// Product API
export const productAPI = {
  getProducts: async (params?: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }): Promise<ProductsResponse> => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getProduct: async (id: string): Promise<{ product: Product }> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (data: CreateProductData): Promise<{ product: Product }> => {
    const formData = new FormData();
    
    // Append all fields to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'image' && value instanceof File) {
          formData.append('image', value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateProduct: async (id: string, data: Partial<CreateProductData>): Promise<{ product: Product }> => {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'image' && value instanceof File) {
          formData.append('image', value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const response = await api.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  getFarmerProducts: async (): Promise<{ products: Product[] }> => {
    const response = await api.get('/products/farmer/my-products');
    return response.data;
  },
};

// Order API
export const orderAPI = {
  createOrder: async (items: { productId: string; quantity: number }[]): Promise<{ order: Order }> => {
    const response = await api.post('/orders', { items });
    return response.data;
  },

  getCustomerOrders: async (): Promise<{ orders: Order[] }> => {
    const response = await api.get('/orders/customer/my-orders');
    return response.data;
  },

  getFarmerOrders: async (): Promise<{ orders: Order[] }> => {
    const response = await api.get('/orders/farmer/my-orders');
    return response.data;
  },

  getOrder: async (id: string): Promise<{ order: Order }> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id: string, status: string): Promise<{ order: Order }> => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  },
};

export default api;