import { useState, useEffect } from 'react';
import { updatePaymentStatus } from '../../../service/anchor/pickupOrderService';

const usePaymentEdit = (refreshData) => {
  const [editOpen, setEditOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('offline');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  
    const mapPaymentToDialogValue = (payment) => {
    switch (payment?.toLowerCase()) {
      case 'pending':
        return 'offline';
      case 'paid':
        return 'paid';
      case 'online':
        return 'online';
      case 'offline':
        return 'offline';
      case 'cod':
        return 'offline';
      default:
        return 'offline';
    }
  };
  // // Reset selected payment when dialog opens
  // useEffect(() => {
  //   if (editOpen) {
  //     setSelectedPayment("offline");
  //   }
  // }, [editOpen]);
  
  // Handle edit dialog open
  const handleEditClick = (orderId, payment) => {
    setSelectedOrderId(orderId);
   setSelectedPayment(mapPaymentToDialogValue(payment));
    setEditOpen(true);
  };
  
  // Handle edit dialog close
  const handleEditClose = () => {
    setEditOpen(false);
    setSelectedOrderId(null);
    setSelectedPayment('');
  };
  
  // Handle payment change
  const handlePaymentChange = (event) => {
    setSelectedPayment(event.target.value);
  };
  
  // Handle payment update submission
  const handleSubmit = async () => {
    try {
      const response = await updatePaymentStatus(selectedOrderId, selectedPayment);
      
      if (response) {
        // Success handling can be added here if needed
        refreshData()
      } else {
        alert(`Failed to update payment status`);
      }
      
      handleEditClose();
    } catch (error) {
      alert('An error occurred while updating payment status.');
    }
  };
  
  return {
    editOpen,
    selectedPayment,
    selectedOrderId,
    handleEditClick,
    handleEditClose,
    handlePaymentChange,
    handleSubmit,
  };
};

export default usePaymentEdit;