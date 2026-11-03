import { useState, useEffect } from 'react';
import customerService from '../../service/owner/customerService';

const useCustomerOverview = () => {
  const [tab, setTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState('');
  const [feedback, setFeedback] = useState([]);
  const [customers, setCustomers] = useState([]);

  // Fetch feedback on component mount
  useEffect(() => {
    const loadFeedback = async () => {
      const result = await customerService.fetchFeedback();
      if (result.success) {
        setFeedback(result.data);
      }
    };

    loadFeedback();
    setCustomers(customerService.getSampleCustomers());
  }, []);

  // Handle opening feedback dialog
  const handleOpenFeedback = (feedbackText) => {
    setSelectedFeedback(feedbackText);
    setDialogOpen(true);
  };

  // Handle closing feedback dialog
  const handleCloseFeedback = () => {
    setDialogOpen(false);
  };

  // Handle blacklisting a customer
  const handleBlacklist = async (customerId) => {
    const result = await customerService.blacklistCustomer(customerId);
    if (result.success) {
      // Update the local state to reflect the change
      setCustomers(prevCustomers => 
        prevCustomers.map(customer => 
          customer.id === customerId 
            ? { ...customer, status: 'Blacklisted' } 
            : customer
        )
      );
    }
  };

  // Render status chip helper
  const renderStatusChip = (status) => {
    return { label: status, color: status === 'Blacklisted' ? 'error' : 'success' };
  };

  return {
    tab,
    setTab,
    dialogOpen,
    selectedFeedback,
    feedback,
    customers,
    handleOpenFeedback,
    handleCloseFeedback,
    handleBlacklist,
    renderStatusChip
  };
};

export default useCustomerOverview;