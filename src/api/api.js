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

export default api;
