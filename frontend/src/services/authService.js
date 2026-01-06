import api from './api';

const authService = {
    // Login
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    // Register
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    // Logout
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Get current user
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    // Get user profile
    getProfile: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    // Update profile
    updateProfile: async (userData) => {
        const response = await api.put('/auth/profile', userData);
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    },

    // Change password
    changePassword: async (passwordData) => {
        const response = await api.put('/auth/password', passwordData);
        return response.data;
    },
};

export default authService;
