import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
    baseURL: '/api/v1', // Laravel API base URL
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add CSRF token if available
        const csrfToken = document.querySelector('meta[name="csrf-token"]');
        if (csrfToken) {
            config.headers['X-CSRF-TOKEN'] = csrfToken.getAttribute('content');
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle 401 unauthorized errors
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            // Redirect to login if not already there
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        
        // Handle 403 forbidden errors
        if (error.response?.status === 403) {
            console.error('Access forbidden:', error.response.data.message);
        }
        
        // Handle 422 validation errors
        if (error.response?.status === 422) {
            console.error('Validation errors:', error.response.data.errors);
        }
        
        // Handle 500 server errors
        if (error.response?.status >= 500) {
            console.error('Server error:', error.response.data.message);
        }
        
        return Promise.reject(error);
    }
);

// API methods
export const apiService = {
    // GET request
    get: (url, config = {}) => {
        return api.get(url, config);
    },
    
    // POST request
    post: (url, data = {}, config = {}) => {
        return api.post(url, data, config);
    },
    
    // PUT request
    put: (url, data = {}, config = {}) => {
        return api.put(url, data, config);
    },
    
    // PATCH request
    patch: (url, data = {}, config = {}) => {
        return api.patch(url, data, config);
    },
    
    // DELETE request
    delete: (url, config = {}) => {
        return api.delete(url, config);
    },
    
    // Upload file
    upload: (url, formData, config = {}) => {
        return api.post(url, formData, {
            ...config,
            headers: {
                'Content-Type': 'multipart/form-data',
                ...config.headers
            }
        });
    }
};

// Authentication API methods
export const authAPI = {
    login: (credentials) => api.post('/login', credentials),
    // logout: () => api.post('/auth/logout'),
};

// Products API methods
export const productsAPI = {
    getAll: (params = {}) => api.get('/products', { params }),
    getById: (id) => api.get(`/products/${id}`),
    create: (productData) => api.post('/products', productData),
    update: (id, productData) => api.put(`/products/${id}`, productData),
    delete: (id) => api.delete(`/products/${id}`),
    search: (query) => api.get('/products/search', { params: { q: query } })
};

// Orders API methods
export const ordersAPI = {
    getAll: (params = {}) => api.get('/orders', { params }),
    getById: (id) => api.get(`/orders/${id}`),
    create: (orderData) => api.post('/orders', orderData),
    update: (id, orderData) => api.put(`/orders/${id}`, orderData),
    cancel: (id) => api.post(`/orders/${id}/cancel`),
    getByUser: (userId) => api.get(`/users/${userId}/orders`)
};

// Cart API methods
export const cartAPI = {
    getCart: () => api.get('/cart'),
    addItem: (productId, quantity = 1) => api.post('/cart/items', { product_id: productId, quantity }),
    updateItem: (itemId, quantity) => api.put(`/cart/items/${itemId}`, { quantity }),
    removeItem: (itemId) => api.delete(`/cart/items/${itemId}`),
    clearCart: () => api.delete('/cart'),
    checkout: (checkoutData) => api.post('/cart/checkout', checkoutData)
};

// Export the main apiService as default
export default apiService;