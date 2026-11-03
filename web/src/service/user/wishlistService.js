import axios from "axios";
import API_URL from "../../config";

const getWishlist = async (userId) => {
  const response = await axios.get(`${API_URL}/api/wishlist/${userId}`);
  return response.data;
};

const addToWishlist = async (userId, servSubType_Id) => {
  return axios.post(`${API_URL}/api/wishlist/add`, { userId, servSubType_Id });
};

const removeFromWishlist = async (userId, servSubType_Id) => {
  return axios.post(`${API_URL}/api/wishlist/remove`, { userId, servSubType_Id });
};

export default {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
