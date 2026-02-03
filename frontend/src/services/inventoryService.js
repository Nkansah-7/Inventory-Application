import api, { API_ENDPOINTS } from './api';

/**
 * Inventory Service
 * Handles all inventory-related API calls
 */

export const inventoryService = {
    /**
     * Get all inventory items
     * @param {Object} params - Query parameters (page, limit, search, etc.)
     * @returns {Promise} Inventory items array
     */
    getAllItems: async (params = {}) => {
        try {
            const response = await api.get(API_ENDPOINTS.INVENTORY, { params });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch inventory items.';
        }
    },

    /**
     * Get single inventory item by ID
     * @param {string} id - Item ID
     * @returns {Promise} Inventory item
     */
    getItemById: async (id) => {
        try {
            const response = await api.get(API_ENDPOINTS.INVENTORY_BY_ID(id));
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch inventory item.';
        }
    },

    /**
     * Create new inventory item
     * @param {Object} itemData - Item data
     * @returns {Promise} Created item
     */
    createItem: async (itemData) => {
        try {
            const response = await api.post(API_ENDPOINTS.INVENTORY, itemData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to create inventory item.';
        }
    },

    /**
     * Update inventory item
     * @param {string} id - Item ID
     * @param {Object} itemData - Updated item data
     * @returns {Promise} Updated item
     */
    updateItem: async (id, itemData) => {
        try {
            const response = await api.put(API_ENDPOINTS.INVENTORY_BY_ID(id), itemData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to update inventory item.';
        }
    },

    /**
     * Delete inventory item
     * @param {string} id - Item ID
     * @returns {Promise} Deletion confirmation
     */
    deleteItem: async (id) => {
        try {
            const response = await api.delete(API_ENDPOINTS.INVENTORY_BY_ID(id));
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to delete inventory item.';
        }
    },

    /**
     * Search inventory items
     * @param {string} query - Search query
     * @returns {Promise} Search results
     */
    searchItems: async (query) => {
        try {
            const response = await api.get(API_ENDPOINTS.INVENTORY_SEARCH, {
                params: { q: query },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Search failed.';
        }
    },
};

export default inventoryService;
