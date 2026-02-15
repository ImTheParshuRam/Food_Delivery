import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth Service
export const authService = {
    register: async (userData) => {
        const response = await api.post('/v1/auth/register', userData);
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/v1/auth/token', credentials);
        if (response.data.token) {
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('authToken');
    },
};

// Restaurant Service
export const restaurantService = {
    getAllRestaurants: async () => {
        const response = await api.get('/v1/restaurant');
        return response.data;
    },

    getRestaurantById: async (id) => {
        const response = await api.get(`/v1/restaurant/${id}`);
        return response.data;
    },

    getRestaurantByOwner: async (username) => {
        const response = await api.get(`/v1/restaurant/owner/${username}`);
        return response.data;
    },

    createRestaurant: async (restaurantData) => {
        const response = await api.post('/v1/restaurant', restaurantData);
        return response.data;
    },

    updateRestaurant: async (id, restaurantData) => {
        const response = await api.put(`/v1/restaurant/${id}`, restaurantData);
        return response.data;
    },
};

// Food Item Service
export const foodItemService = {
    getAllFoodItems: async () => {
        const response = await api.get('/v1/fooditem');
        return response.data;
    },

    getFoodItemsByRestaurant: async (restaurantId) => {
        const response = await api.get(`/v1/fooditem/${restaurantId}`);
        return response.data;
    },

    getFoodItemById: async (id) => {
        const response = await api.get(`/v1/fooditem/${id}`);
        return response.data;
    },

    createFoodItem: async (foodItemData) => {
        const response = await api.post('/v1/fooditem', foodItemData);
        return response.data;
    },

    updateFoodItem: async (id, foodItemData) => {
        const response = await api.put(`/v1/fooditem/${id}`, foodItemData);
        return response.data;
    },

    deleteFoodItem: async (id) => {
        const response = await api.delete(`/v1/fooditem/${id}`);
        return response.data;
    },
};

// Order Service
export const orderService = {
    createOrder: async (orderData) => {
        const response = await api.post('/v1/order', orderData);
        return response.data;
    },

    getOrderById: async (id) => {
        const response = await api.get(`/v1/order/${id}`);
        return response.data;
    },

    getUserOrders: async (userId) => {
        const response = await api.get(`/v1/order/user/${userId}`);
        return response.data;
    },

    getRestaurantOrders: async (restaurantId) => {
        const response = await api.get(`/v1/order/restaurant/${restaurantId}`);
        return response.data;
    },

    updateOrderStatus: async (orderId, status) => {
        const response = await api.put(`/v1/order/${orderId}/status`, { status });
        return response.data;
    },
};

// Payment Service
export const paymentService = {
    processPayment: async (paymentData) => {
        const response = await api.post('/v1/payment', paymentData);
        return response.data;
    },

    getPaymentById: async (id) => {
        const response = await api.get(`/v1/payment/${id}`);
        return response.data;
    },
};

// User Service
export const userService = {
    getUserProfile: async (userId) => {
        const response = await api.get(`/v1/user/${userId}`);
        return response.data;
    },

    updateUserProfile: async (userId, userData) => {
        const response = await api.put(`/v1/user/${userId}`, userData);
        return response.data;
    },

    getAllUsers: async () => {
        const response = await api.get('/v1/user');
        return response.data;
    },
};

export default api;
