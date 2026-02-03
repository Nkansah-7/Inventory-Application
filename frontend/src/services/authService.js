import api, { API_ENDPOINTS } from './api';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

export const authService = {
    /**
     * Login user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise} User data and token
     */
    login: async (email, password) => {
        try {
            const response = await api.post(API_ENDPOINTS.LOGIN, {
                email,
                password,
            });

            // Store token and user data
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Login failed. Please try again.';
        }
    },

    /**
     * Register new user
     * @param {Object} userData - User registration data
     * @returns {Promise} User data and token
     */
    register: async (userData) => {
        try {
            const response = await api.post(API_ENDPOINTS.REGISTER, userData);

            // Store token and user data
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Registration failed. Please try again.';
        }
    },

    /**
     * Logout user
     */
    logout: async () => {
        try {
            await api.post(API_ENDPOINTS.LOGOUT);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear local storage regardless of API response
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },

    /**
     * Get current user
     * @returns {Promise} Current user data
     */
    getCurrentUser: async () => {
        try {
            const response = await api.get(API_ENDPOINTS.ME);

            // Update stored user data
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data.user;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to get user data.';
        }
    },

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    /**
     * Get stored user data
     * @returns {Object|null}
     */
    getStoredUser: () => {
        const userStr = localStorage.getItem('user');
        try {
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            return null;
        }
    },
};

export default authService;
