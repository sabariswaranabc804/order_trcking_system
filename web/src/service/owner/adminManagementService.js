import api from '../api';

const adminManagementService = {
  // Fetch all users
  getAllUsers: async () => {
    try {
      const response = await api.get('/v2/superadmin/get-all-user');
      return response.data;
    } catch (error) {
      /* console.error('Error fetching users:', error); */
      throw error;
    }
  },

  // Create admin or owner
  createAdminOrOwner: async (userData, role) => {
    try {
      const response = await api.post('/v2/superadmin/create-admin', {
        ...userData,
        role
      });
      return response.data;
    } catch (error) {
      /* console.error('Error creating admin/owner:', error); */
      throw error;
    }
  },

  // Create deliveryman
  createDeliveryman: async (userData) => {
    try {
      const response = await api.post('/create/deliveryman', userData);
      return response.data;
    } catch (error) {
      /* console.error('Error creating deliveryman:', error); */
      throw error;
    }
  },

  // Create customer
  createCustomer: async (userData) => {
    try {
      const response = await api.post('/users', {
        ...userData,
        country: 'India', 
        area: 'Annamalai Nagar', 
        state: 'tamilnadu', 
        city: 'Trichy', 
        street: 'Kumudham Salai', 
        floorDoorNumber: '1 floor', 
        door: 'NO 12', 
        pincode: '620018', 
        landmark: '620018',
        location: {
          latitude: '10.8278097', 
          longitude: '78.6844134' 
        }
      });
      return response.data;
    } catch (error) {
      /* console.error('Error creating customer:', error); */
      throw error;
    }
  },

  // Update user
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/v2/superadmin/update-user/${userId}`, {
        user_Name: userData.name,
        email_ID: userData.email,
        mobile_Number: userData.mobile,
        alter_Mobile_number: userData.alternativePhone
      });
      return response.data;
    } catch (error) {
      /* console.error('Error updating user:', error); */
      throw error;
    }
  },

  // Update user status (active/inactive)
  updateUserStatus: async (userId, isActive) => {
    try {
      const response = await api.put(`/v2/superadmin/update-user-status/${userId}`, {
        isActive
      });
      return response.data;
    } catch (error) {
      /* console.error('Error updating user status:', error); */
      throw error;
    }
  }
};

export default adminManagementService;