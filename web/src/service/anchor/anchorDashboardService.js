import axios from 'axios';
import API_URL from '../../config';

// Function to fetch user information by ID
export const fetchUserInfo = async (userID) => {
  try {
    const response = await axios.get(`${API_URL}/api/users/${userID}`);
    return response.data;
  } catch (error) {
    /* console.error('Error fetching user info:', error); */
    throw error;
  }
};

// Function to fetch customers
export const fetchCustomers = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/customer`);
    return response.data.data;
  } catch (error) {
    /* console.error('Error fetching customers:', error); */
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

// Function to fetch all orders for a deliveryman
export const fetchAllOrders = async (deliverymanId) => {
  try {
    const response = await axios.get(`${API_URL}/api/myorders/${deliverymanId}/all`);
    return response.data;
  } catch (error) {
    /* console.error('Error fetching orders:', error); */
    throw error;
  }
};

// Function to fetch order data for the last seven days
export const fetchOrderDataByDate = async (deliverymanId, lastSevenDays) => {
  try {
    const orders = await fetchAllOrders(deliverymanId);
    
    // Count orders by date
    const orderCounts = lastSevenDays.map(date => {
      // Filter orders by matching the order_date with each date
      const count = orders.filter(order => order.order_date.startsWith(date)).length;
      return count;
    });

    return orderCounts;
  } catch (error) {
    /* console.error('Error fetching order data by date:', error); */
    return Array(7).fill(0); // Return an array of zeros if there's an error
  }
};