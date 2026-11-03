import api from '../api';

const revenueService = {
  // Fetch all order details for revenue calculation
  getAllOrderDetails: async () => {
    try {
      const response = await api.get('/admin/all-order-details');
      return response.data.data;
    } catch (error) {
      /* console.error('Error fetching order details:', error); */
      throw error;
    }
  },
};

export default revenueService;