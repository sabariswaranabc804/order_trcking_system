import api from '../api';
import API_URL from '../../config';

// Fetch customers
const fetchCustomers = async () => {
  try {
    const response = await api.get('/customer');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Fetch service subtypes
const fetchServiceSubTypes = async () => {
  try {
    const response = await api.get('/serviceSubTypes');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch user addresses
const fetchUserAddresses = async (userId) => {
  try {
    const response = await api.get(`/user-addresses/${userId}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Submit order
const submitOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { fetchCustomers, fetchServiceSubTypes, fetchUserAddresses, submitOrder };