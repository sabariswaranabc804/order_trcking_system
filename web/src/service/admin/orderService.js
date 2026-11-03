import axios from 'axios';
import API_URL from '../../config';

// Order related API calls
export const fetchAllOrders = async (type) => {
  try {
    const url = type
      ? `${API_URL}/api/admin/all-order-details?type=${encodeURIComponent(type)}`
      : `${API_URL}/api/admin/all-order-details`;

    const response = await axios.get(url);
    return response.data.data;
  } catch (error) {
    /* console.error("Error fetching orders:", error); */
    throw error;
  }
};


export const fetchOrderDetails = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/api/order-details/${orderId}`);
    return response.data.data;
  } catch (error) {
    /* console.error('Error fetching order details:', error); */
    throw error;
  }
};

export const fetchDeliverymen = async (companyId) => {
  try {
    const response = await axios.get(`${API_URL}/api/deliveryman/${companyId}`);
    return response.data;
  } catch (error) {
    /* console.error('Error fetching deliverymen:', error); */
    throw error;
  }
};

export const updateOrderToReadyToDrop = async (orderId, mobileNumber) => {
  try {
    const response = await axios.put(`${API_URL}/api/orders/${orderId}/ready-to-drop`, { mobile_Number: mobileNumber,oneWay:true });
    return response.data;
  } catch (error) {
    /* console.error('Error updating order to Ready to Drop', error); */
    throw error;
  }
};

export const updateOrderToCompleted = async (orderId) => {
  try {
    const response = await axios.put(`${API_URL}/api/orders/${orderId}/completed`);
    return response.data;
  } catch (error) {
    /* console.error('Error updating order to Completed', error); */
    throw error;
  }
};

export const assignDeliverymanToOrder = async (orderId, statusName, deliverymanIds) => {
  try {
    const response = await axios.post(`${API_URL}/api/assign-deliveryman`, {
      orderId,
      status_Name: statusName,
      deliverymanIds
    });
    return response.data;
  } catch (error) {
    /* console.error('Error assigning deliveryman to order', error); */
    throw error;
  }
};

export const updatePaymentStatus = async (orderId, paymentStatus) => {
  try {
    const response = await axios.put(`${API_URL}/api/orders/updatePayment`, {
      orderId,
      paymentStatus,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    /* console.error('Error updating payment status:', error); */
    throw error;
  }
};