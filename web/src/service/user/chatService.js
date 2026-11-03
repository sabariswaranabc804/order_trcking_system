import axios from "axios";
import API_URL from "../../config";

export const getMessages = async (senderId, receiverId) => {
  const res = await axios.get(`${API_URL}/api/v2/superadmin/messages/${senderId}/${receiverId}`);
  return res.data || [];
};

export const sendMessage = async (msgObj) => {
  await axios.post(`${API_URL}/api/v2/superadmin/send`, msgObj);
};
