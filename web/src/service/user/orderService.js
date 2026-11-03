import axios from 'axios';
import API_URL from '../../config';

export const processOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_URL}/api/orders`, orderData);
    return response.data;
  } catch (error) {
    /* console.error('Error placing order:', error); */
    throw error;
  }
};