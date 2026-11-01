import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor: thêm token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Product APIs
export const getProducts = (params) => api.get('/products', { params });
export const getProductById = (id) => api.get(`/products/${id}`);
export const getProductBySlug = (slug) => api.get(`/products/slug/${slug}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const addReview = (id, data) => api.post(`/products/${id}/reviews`, data);

// User APIs
export const register = (data) => api.post('/users/register', data);
export const login = (data) => api.post('/users/login', data);
export const getMe = () => api.get('/users/me');
export const updateProfile = (data) => api.put('/users/me', data);
export const toggleFavorite = (productId) => api.put(`/users/favorites/${productId}`);
export const getFavorites = () => api.get('/users/favorites');

// Order APIs
export const createOrder = (data) => api.post('/orders', data);
export const getMyOrders = () => api.get('/orders/my-orders');
export const getOrderById = (id) => api.get(`/orders/${id}`);
export const updateOrderStatus = (id, data) => api.put(`/orders/${id}/status`, data);
export const getAllOrders = () => api.get('/orders');

export default api;