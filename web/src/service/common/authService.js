
// src/services/authService.js
import api from "../api";

const authService = {
  sendOTP: async (email) => {
    try {
      const response = await api.post('/auth/send-otp', { email }, { withCredentials: true });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to send OTP' };
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Registration failed' };
    }
  },

  verifyOTP: async (email, otp) => {
    try {
      const response = await api.post('/auth/verify-otp', { email, otp }, { withCredentials: true });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Invalid OTP' };
    }
  }
};

export default authService;