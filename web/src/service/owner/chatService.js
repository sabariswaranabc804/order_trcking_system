import api from '../api';
import API_URL from '../../config';
import io from 'socket.io-client';

// Socket connection
const socket = io(API_URL, {
  path: '/socket.io/',
  transports: ['websocket', 'polling']
});

// Fetch messages between two users
const fetchMessages = async (senderId, receiverId) => {
  try {
    const res = await api.get(`/v2/superadmin/messages/${senderId}/${receiverId}`);
    return res.data;
  } catch (error) {
    /* console.error("Error fetching messages:", error); */
    return [];
  }
};

// Send a message
const sendMessage = async (messageData) => {
  try {
    await api.post(`/v2/superadmin/send`, messageData);
    socket.emit('sendMessage', messageData);
    return true;
  } catch (error) {
    /* console.error("Error sending message:", error); */
    return false;
  }
};

// Fetch users by type
const fetchUsersByType = async (userType) => {
  try {
    let userTypeId;
    switch (userType) {
      case 'admin': userTypeId = '2'; break;
      case 'deliveryman': userTypeId = '4'; break;
      case 'owner': userTypeId = '1'; break;
      case 'customer': userTypeId = '5'; break;
      default: userTypeId = '4'; // Default to deliveryman
    }
    
    const response = await api.get(`/v2/superadmin/user/${userTypeId}`);
    return response.data;
  } catch (error) {
    /* console.error(`Error fetching ${userType}:`, error); */
    return [];
  }
};

// Get user role code
const getUserRoleCode = (userType) => {
  if (userType === 'admin') return '2';
  if (userType === 'deliveryman') return '4';
  if (userType === 'customer') return '5';
  if (userType === 'owner') return '1';
  return '3'; // Default
};

const chatService = {
  socket,
  fetchMessages,
  sendMessage,
  fetchUsersByType,
  getUserRoleCode
};

export default chatService;