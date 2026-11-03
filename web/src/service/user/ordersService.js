import axios from "axios";
import API_URL from "../../config";

export const fetchUserOrders = async (userId) => {
  const response = await axios.get(`${API_URL}/api/orders/user/${userId}`);
  return response.data.data;
};

export const fetchOrderDetails = async (orderId) => {
  const response = await axios.get(`${API_URL}/api/order-details/${orderId}`);
  return response.data.data;
};

export const cancelOrder = async (orderId) => {
  return await axios.put(`${API_URL}/api/orders/cancel/${orderId}`);
};

export const setOrderCompleted = async (orderId) => {
  return await axios.put(`${API_URL}/api/orders/${orderId}/completed`);
};
