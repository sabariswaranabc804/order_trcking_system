import api from '../api';

// Function to get the last seven days in 'YYYY-MM-DD' format
const getLastSevenDays = () => {
  const dates = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split('T')[0]); // Format as 'YYYY-MM-DD'
  }
  return dates;
};

// Fetch user information by ID
const fetchUserInfo = async (userID) => {
  try {
    const response = await api.get(`/users/${userID}`);
    return response.data;
  } catch (error) {
    /* console.error('Error fetching user info:', error); */
    throw error;
  }
};

// Fetch all customers
const fetchCustomers = async () => {
  try {
    const response = await api.get('/customer');
    return response.data.data;
  } catch (error) {
    /* console.error('Error fetching customers:', error); */
    throw error;
  }
};

// Fetch deliverymen by company ID
const fetchDeliverymen = async (companyId) => {
  try {
    const response = await api.get(`/deliveryman`);
    return response.data;
  } catch (error) {
    /* console.error('Error fetching deliverymen:', error); */
    throw error;
  }
};

// Fetch all orders
const fetchOrders = async () => {
  try {
    const response = await api.get('/admin/all-order-details');
    return response.data.data;
  } catch (error) {
    /* console.error('Error fetching orders:', error); */
    throw error;
  }
};

// Fetch order data for the last seven days
const fetchOrderData = async () => {
  try {
    const orders = await fetchOrders();
    const lastSevenDays = getLastSevenDays();

    // Count orders by date
    const orderCounts = lastSevenDays.map(date => {
      // Filter orders by matching the order_date with each date in the last seven days
      const count = orders.filter(order => order.order_date.startsWith(date)).length;
      return count;
    });

    return orderCounts; // Return counts for the last seven days
  } catch (error) {
    /* console.error('Error fetching order data:', error); */
    return Array(7).fill(0); // Return an array of zeros if there's an error
  }
};

export {
  getLastSevenDays,
  fetchUserInfo,
  fetchCustomers,
  fetchDeliverymen,
  fetchOrders,
  fetchOrderData
};