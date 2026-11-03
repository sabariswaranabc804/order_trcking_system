import { useState, useEffect } from 'react';
import customerService from '../../service/admin/customerService';

const useCustomerTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState(customerService.getDefaultCustomerData());

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const result = await customerService.fetchCustomers();
      if (result.success) {
        setUsers(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle dialog open/close
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    // Reset form when closing
    setNewCustomer(customerService.getDefaultCustomerData());
  };

  // Handle input change
  const handleChange = (e) => {
    setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
  };

  // Submit new customer
  const handleSubmit = async () => {
    try {
      const result = await customerService.createCustomer(newCustomer);
      if (result.success) {
        await fetchUsers(); // Refresh customer list
        handleClose();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    users,
    loading,
    error,
    open,
    newCustomer,
    handleOpen,
    handleClose,
    handleChange,
    handleSubmit
  };
};

export default useCustomerTable;