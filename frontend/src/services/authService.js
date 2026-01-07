// frontend/src/services/authService.js
import api from './api';

const authService = {
    // Login
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            
            // Backend returns: {token, id, username, email, fullName, role, department}
            // Convert to user object for frontend
            const user = {
                id: response.data.id,
                username: response.data.username,
                email: response.data.email,
                fullName: response.data.fullName,
                role: response.data.role,
                department: response.data.department
            };
            localStorage.setItem('user', JSON.stringify(user));
            
            return { ...response.data, user }; // Return with user object
        }
        return response.data;
    },

    // Register
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        
        // Register returns MessageResponse, need to login after
        if (response.data.message === 'User registered successfully!') {
            // Auto-login after successful registration
            return await authService.login({
                username: userData.username,
                password: userData.password
            });
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
        const response = await api.get('/users/me');
        return response.data;
    },

    // Update profile
    updateProfile: async (userData) => {
        const response = await api.put('/users/me', userData);
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    },
};

export default authService;