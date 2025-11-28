import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3030',
});

export const getProducts = () => api.get('/products');
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);

export const getCategories = () => api.get('/categories');
export const getCategory = (id) => api.get(`/categories/${id}`);
export const createCategory = (data) => api.post('/categories', data);

export const createCart = () => api.post('/cart');
export const getCart = (id) => api.get(`/cart/${id}`);
export const addToCart = (cartId, productId, quantity) => api.post(`/cart/${cartId}/items`, { productid: productId, quantity });
export const removeFromCart = (cartId, productId) => api.delete(`/cart/${cartId}/items/${productId}`);

export const generateInvoice = (cartId) => api.get(`/invoice/${cartId}`);

// Auth endpoints
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getProfile = () => api.get('/auth/profile');

// Orders endpoint
export const getOrders = () => api.get('/orders');
export const createOrder = (cartId, items) => api.post('/orders', { items });

// Attach token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Optionally handle 401 responses globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
            // Unauthorized, clear token
            localStorage.removeItem('token');
            // Notify app to logout
            if (typeof window !== 'undefined' && window.dispatchEvent) {
                try { window.dispatchEvent(new Event('auth-logout')); } catch {}
            }
        }
        return Promise.reject(error);
    }
);

export default api;
