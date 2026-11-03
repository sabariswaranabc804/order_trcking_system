import axios from 'axios';
import API_URL from '../../config';

// Function to fetch pending orders
export const fetchPendingOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/admin/all-order-detail`);
    return response.data.data;
  } catch (error) {
    /* console.error('Error fetching pending orders:', error); */
    throw error;
  }
};

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

// Function to fetch assigned orders for a deliveryman
export const fetchAssignedOrders = async (deliverymanId) => {
  try {
    const response = await axios.get(`${API_URL}/api/assignedOrders/${deliverymanId}`);
    return response.data;
  } catch (error) {
    /* console.error('Error fetching assigned orders:', error); */
    throw error;
  }
};

// Function to update order status to Ready to Drop
export const updateOrderToReadyDrop = async (orderId) => {
  try {
    const response = await axios.put(`${API_URL}/api/orders/${orderId}/ready-to-drop`);
    return response.data;
  } catch (error) {
    /* console.error('Error updating order to Ready to Drop:', error); */
    throw error;
  }
};

// Function to update order status to Completed
export const updateOrderToCompleted = async (orderId) => {
  try {
    const response = await axios.put(`${API_URL}/api/orders/${orderId}/completed`);
    return response.data;
  } catch (error) {
    /* console.error('Error updating order to Completed:', error); */
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

// Function to accept an order by a deliveryman
export const acceptOrder = async (orderId, deliverymanId) => {
  try {
    const response = await axios.post(`${API_URL}/api/deliveryman/accept-order`, {
      orderId, 
      deliverymanId
    });
    return response.data;
  } catch (error) {
    /* console.error('Error accepting order:', error); */
    throw error;
  }
};