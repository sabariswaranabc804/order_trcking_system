import axios from 'axios';
import API_URL from '../../config';

// Cart service following your existing API pattern
export const cartService = {
  // Get all cart items
  getCartItems: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/cart`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      /* console.error('Error fetching cart items:', error); */
      throw error.response?.data || error.message;
    }
  },

  // Get cart count
  getCartCount: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/cart/count`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      /* console.error('Error fetching cart count:', error); */
      throw error.response?.data || error.message;
    }
  },

  // Add item to cart
  addToCart: async (item) => {
    try {
      const response = await axios.post(`${API_URL}/api/cart/add`, item, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      /* console.error('Error adding to cart:', error); */
      throw error.response?.data || error.message;
    }
  },

  // Remove item from cart
  removeFromCart: async (servSubTypeId) => {
    try {
      const response = await axios.delete(`${API_URL}/api/cart/remove/${servSubTypeId}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      /* console.error('Error removing from cart:', error); */
      throw error.response?.data || error.message;
    }
  },

  // Update item quantity
  updateQuantity: async (servSubTypeId, quantity) => {
    try {
      const response = await axios.put(`${API_URL}/api/cart/update/${servSubTypeId}`, 
        { quantity }, 
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      /* console.error('Error updating quantity:', error); */
      throw error.response?.data || error.message;
    }
  },

  // Increase quantity
  increaseQuantity: async (servSubTypeId) => {
    try {
      const response = await axios.put(`${API_URL}/api/cart/increase/${servSubTypeId}`, {}, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      /* console.error('Error increasing quantity:', error); */
      throw error.response?.data || error.message;
    }
  },

  // Decrease quantity
  decreaseQuantity: async (servSubTypeId) => {
    try {
      const response = await axios.put(`${API_URL}/api/cart/decrease/${servSubTypeId}`, {}, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      /* console.error('Error decreasing quantity:', error); */
      throw error.response?.data || error.message;
    }
  },

  // Clear entire cart
  clearCart: async () => {
    try {
      const response = await axios.delete(`${API_URL}/api/cart/clear`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      /* console.error('Error clearing cart:', error); */
      throw error.response?.data || error.message;
    }
  }
};