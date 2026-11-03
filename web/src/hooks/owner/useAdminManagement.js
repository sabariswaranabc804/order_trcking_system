import { useState, useEffect } from 'react';
import adminManagementService from '../../service/owner/adminManagementService';

const useAdminManagement = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Separate states for each user type
  const [admins, setAdmins] = useState([]);
  const [owners, setOwners] = useState([]);
  const [deliverymen, setDeliverymen] = useState([]);
  const [customers, setCustomers] = useState([]);
  
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    mobile: '',
    usercode: '',
    companyName: '',
    alternativePhone: '',
    address: '',
    city: '',
    isActive: true
  });

  // Fetch all users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to fetch all users and categorize them
  const fetchUsers = async () => {
    try {
      const users = await adminManagementService.getAllUsers();
      
      const adminsArray = [];
      const ownersArray = [];
      const deliverymenArray = [];
      const customersArray = [];
      
      users.forEach(user => {
        const formattedUser = {
          id: user.user_ID,
          name: user.user_Name,
          email: user.email_ID,
          mobile: user.mobile_Number,
          alter_Mobile_number: user.alter_Mobile_number,
          created_Date: user.created_Date,
          isActive: user.active_Flag
        };
        
        switch (user.user_Type_ID) {
          case 2:
            adminsArray.push(formattedUser);
            break;
          case 3:
            ownersArray.push(formattedUser);
            break;
          case 4:
            deliverymenArray.push(formattedUser);
            break;
          case 5:
            customersArray.push(formattedUser);
            break;
          default:
            break;
        }
      });
      
      setAdmins(adminsArray);
      setOwners(ownersArray);
      setDeliverymen(deliverymenArray);
      setCustomers(customersArray);
    } catch (error) {
      /* console.error('Error fetching users:', error); */
    }
  };

  // Get current data based on selected tab
  const getCurrentData = () => {
    switch(selectedTab) {
      case 0: return { data: owners, setData: setOwners, title: 'Owner' };
      case 1: return { data: admins, setData: setAdmins, title: 'Admin' };
      case 2: return { data: deliverymen, setData: setDeliverymen, title: 'Deliveryman' };
      case 3: return { data: customers, setData: setCustomers, title: 'Customer' };
      default: return { data: admins, setData: setAdmins, title: 'Admin' };
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Handle dialog open
  const handleOpenDialog = () => {
    setNewUser({
      name: '',
      email: '',
      mobile: '',
      usercode: '',
      companyName: '',
      alternativePhone: '',
      address: '',
      city: '',
      isActive: true
    });
    setOpenDialog(true);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setIsEditMode(false);
  };

  // Handle edit user
  const handleEdit = (item) => {
    setNewUser({
      ...newUser,
      name: item.name || '',
      email: item.email || '',
      mobile: item.mobile || '',
      alternativePhone: item.alter_Mobile_number || '',
      id: item.id // Keep track of which user we're editing
    });
    setIsEditMode(true);
    setOpenDialog(true);
  };

  // Handle update user
  const handleUpdate = async () => {
    try {
      const response = await adminManagementService.updateUser(newUser.id, newUser);

      if (response) {
        const { setData } = getCurrentData();
        setData(prev =>
          prev.map(item =>
            item.id === newUser.id
              ? {
                  ...item,
                  name: newUser.name,
                  email: newUser.email,
                  mobile: newUser.mobile,
                  alter_Mobile_number: newUser.alternativePhone
                }
              : item
          )
        );
        handleCloseDialog();
        fetchUsers(); // Refresh the data
      }
    } catch (error) {
      /* console.error('Error updating user:', error); */
      alert('Failed to update user');
    }
  };

  // Handle add user
  const handleAdd = async () => {
    try {
      const { setData } = getCurrentData();
      let response;

      switch(selectedTab) {
        case 0: // Owner
        case 1: // Admin
          response = await adminManagementService.createAdminOrOwner(
            newUser, 
            selectedTab === 0 ? 3 : 2
          );
          break;
        
        case 2: // Deliveryman
          response = await adminManagementService.createDeliveryman(newUser);
          break;
        
        case 3: // Customer
          response = await adminManagementService.createCustomer(newUser);
          break;
      }

      if (response) {
        setData(prev => [...prev, { ...response, id: response._id || Date.now() }]);
        handleCloseDialog();
      }
    } catch (error) {
      /* console.error('Error creating user:', error); */
      // You might want to add error handling here (e.g., showing an error message)
    }
  };

  // Handle toggle active status
  const handleToggleActive = async (id, isActive) => {
    try {
      await adminManagementService.updateUserStatus(id, !isActive);
      
      // Refresh the data after successful update
      const { setData } = getCurrentData();
      setData(prev =>
        prev.map(item =>
          item.id === id ? { ...item, isActive: !isActive } : item
        )
      );
      
      // Refresh the entire user list
      fetchUsers();
    } catch (error) {
      /* console.error('Error updating user status:', error); */
      alert('Failed to update user status');
    }
  };

  return {
    selectedTab,
    openDialog,
    isEditMode,
    admins,
    owners,
    deliverymen,
    customers,
    newUser,
    setNewUser,
    handleTabChange,
    getCurrentData,
    handleOpenDialog,
    handleCloseDialog,
    handleEdit,
    handleUpdate,
    handleAdd,
    handleToggleActive
  };
};

export default useAdminManagement;