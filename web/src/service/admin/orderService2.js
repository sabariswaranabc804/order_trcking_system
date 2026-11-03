import axios from 'axios';
import API_URL from '../../config';
import { toast } from 'react-toastify';

export const updateOrderStatus = async ({ orderId, oldStatus, adminId, deliverymanId, action,ordertype }) => {
  try {
    const response = await axios.post(`${API_URL}/api/update-status`, {
      orderId,
      oldStatus,
      adminId,
      deliverymanId,
      action,
      ordertype
    });
    toast.success("Order status updated");
    return response.data;
  } catch (error) {
    /* console.error("API error:", error); */
    throw error;
  }
};

// Fetch all orders
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


// Fetch order details by ID
export const fetchOrderDetails = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/api/order-details/${orderId}`);
    return response.data.data;
  } catch (error) {
    /* console.error('Error fetching order details:', error); */
    throw error;
  }
};

// Fetch deliverymen by company ID
export const fetchDeliverymen = async (companyId) => {
  try {
    const response = await axios.get(`${API_URL}/api/deliveryman`);
    return response.data;
  } catch (error) {
    /* console.error('Error fetching deliverymen:', error); */
    throw error;
  }
};

// Fetch rejected orders list
export const fetchRejectedOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/rejectlist`);
    return response.data;
  } catch (error) {
    /* console.error('Error fetching rejected orders:', error); */
    throw error;
  }
};

// Update order to ready to drop
export const updateOrderToReadyToDrop = async (orderId) => {
  try {
    const response = await axios.put(`${API_URL}/api/orders/${orderId}/ready-to-drop`);
    return response.data;
  } catch (error) {
    /* console.error('Error updating order to Ready to Drop', error); */
    throw error;
  }
};

// Update order to completed
export const updateOrderToCompleted = async (orderId) => {
  try {
    const response = await axios.put(`${API_URL}/api/orders/${orderId}/completed`);
    return response.data;
  } catch (error) {
    /* console.error('Error updating order to Completed', error); */
    throw error;
  }
};

// Assign deliverymen to order
export const assignDeliverymenToOrder = async (orderId, statusName, deliverymanIds,admin_id) => {
  try {
    const response = await axios.post(`${API_URL}/api/assign-deliveryman`, {
      orderId,
      status_Name: statusName,
      deliverymanIds,
      admin_id
    });
    return response.data;
  } catch (error) {
    /* console.error('Error assigning task to deliveryman:', error); */
    throw error;
  }
};

// Update payment status
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