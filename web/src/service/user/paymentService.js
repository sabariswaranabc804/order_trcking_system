import axios from 'axios';
import API_URL from '../../config';

export const createRazorpayOrder = async (amount) => {
  try {
    const response = await axios.post(`${API_URL}/api/razorpay/create-order`, {
      amount: amount * 100, // Razorpay expects amount in paise
    });
    return response.data;
  } catch (error) {
    /* console.error('Error creating Razorpay order:', error); */
    throw error;
  }
};

export const verifyRazorpayPayment = async (paymentData) => {
  try {
    const response = await axios.post(`${API_URL}/api/razorpay/verify-payment`, paymentData);
    return response.data;
  } catch (error) {
    /* console.error('Error verifying payment:', error); */
    throw error;
  }
};