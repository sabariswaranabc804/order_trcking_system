import axios from 'axios';
import API_URL from '../../config';

export const fetchAddresses = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/api/getAddress/${userId}`);
    return response.data;
  } catch (error) {
    /* console.error('Error fetching addresses:', error); */
    throw error;
  }
};

export const deleteAddress = async (userId, addressId) => {
  try {
    const response = await axios.delete(`${API_URL}/api/disable/address/${userId}/${addressId}`);
    return response.data;
  } catch (error) {
    /* console.error('Error deleting address:', error); */
    throw error;
  }
};

export const addAddress = async (addressData) => {
  try {
    const response = await axios.post(`${API_URL}/api/addAddress`, addressData);
    return response.data;
  } catch (error) {
    /* console.error('Error adding address:', error); */
    throw error;
  }
};

export const updateAddress = async (addressData) => {
  try {
    const response = await axios.put(`${API_URL}/api/editAddress`, addressData);
    return response.data;
  } catch (error) {
    /* console.error('Error updating address:', error); */
    throw error;
  }
};

export const fetchPostOfficeData = async (pincode) => {
  try {
    const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
    return response.data;
  } catch (error) {
    /* console.error('Error fetching post office data:', error); */
    throw error;
  }
};