import axios from 'axios';
import API_URL from '../../config';

// Function to fetch deliverymen by company ID
export const fetchDeliverymen = async (companyId) => {
  try {
    const response = await axios.get(`${API_URL}/api/deliveryman/${companyId}`);
    return response.data;
  } catch (error) {
    /* console.error('Error fetching deliverymen:', error); */
    throw error;
  }
};

// Function to fetch all orders for a deliveryman
export const fetchAllOrders = async (deliverymanId) => {
  try {
    const response = await axios.get(`${API_URL}/api/myorderhistory/${deliverymanId}/all`);
    return response.data;
  } catch (error) {
    /* console.error('Error fetching orders:', error); */
    throw error;
  }
};

// Function to fetch order details by ID
export const fetchOrderDetails = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/api/order-details/${orderId}`);
    return response.data.data;
  } catch (error) {
    /* console.error('Error fetching order details:', error); */
    throw error;
  }
};

// Function to reject an order
export const rejectOrder = async (orderId, statusName) => {
  try {
    const response = await axios.post(`${API_URL}/api/myorder/reject-order`, {
      orderId: orderId,
      status_Name: statusName,
    });
    return response.data;
  } catch (error) {
    /* console.error('Error rejecting order:', error); */
    throw error;
  }
};

// Function to update payment status
export const updatePaymentStatus = async (orderId, paymentStatus) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/orders/updatePayment`,
      {
        orderId: orderId,
        paymentStatus: paymentStatus,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    /* console.error('Error updating payment status:', error); */
    throw error;
  }
};