import { useState, useEffect } from 'react';
import chatService from '../../service/owner/chatService';

const useDeliverymanChat = (currentUserId, currentUserRole) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState('deliveryman'); // Default to deliveryman

  useEffect(() => {
    // Fetch users based on selected type
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await chatService.fetchUsersByType(userType);
        setUsers(data);
        setSelectedUser(null); // Reset selected user when changing types
        setLoading(false);
      } catch (error) {
        /* console.error(`Error in useDeliverymanChat:`, error); */
        setUsers([]);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userType]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setUserType(newValue);
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    const name = user.user_Name || user.name;
    const contact = user.mobile_Number || user.phone;
    
    return (
      (name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (contact?.includes(searchQuery))
    );
  });

  // Get user ID based on user type
  const getUserId = (user) => {
    return user.user_Code?.toString() || user.id?.toString();
  };

  // Get user role based on user type
  const getUserRole = () => {
    return chatService.getUserRoleCode(userType);
  };

  // Get user name based on user type
  const getUserName = (user) => {
    return user.user_Name || user.name || 'Unknown';
  };

  // Get user contact based on user type
  const getUserContact = (user) => {
    if (userType === 'deliveryman') {
      return user.contact || 'No contact';
    } else {
      return user.mobile_Number || user.phone || 'No contact';
    }
  };

  return {
    users,
    selectedUser,
    setSelectedUser,
    searchQuery,
    setSearchQuery,
    loading,
    userType,
    handleTabChange,
    filteredUsers,
    getUserId,
    getUserRole,
    getUserName,
    getUserContact,
    currentUserId,
    currentUserRole
  };
};

export default useDeliverymanChat;