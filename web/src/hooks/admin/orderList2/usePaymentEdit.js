import { useState, useEffect } from 'react';
import { updatePaymentStatus } from '../../../service/admin/orderService2';

export const usePaymentEdit = ( refreshOrder) => {
  const [editOpen, setEditOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState('offline');
  
  // // Reset payment to offline when dialog opens
  // useEffect(() => {
  //   if (editOpen) {
  //     setSelectedPayment("offline");
  //   }
  // }, [editOpen]);
  
    // Convert database payment value to dialog value
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
  // Handle opening payment edit dialog
  const handleEditClick = (orderId, payment) => {
    setSelectedOrderId(orderId);
    setSelectedPayment(mapPaymentToDialogValue(payment));
    setEditOpen(true);
  };
  
  // Handle closing payment edit dialog
  const handleEditClose = () => {
    setEditOpen(false);
    setSelectedOrderId(null);
    setSelectedPayment('');
  };
  
  // Handle payment type change
  const handlePaymentChange = (event) => {
    setSelectedPayment(event.target.value);
  };
  
  // Handle submitting payment update
  const handleSubmit = async () => {
    try {
      const response = await updatePaymentStatus(selectedOrderId, selectedPayment);
      handleEditClose();
    refreshOrder();
   
      return true;
    } catch (error) {
      alert('An error occurred while updating payment status.');
      return false;
    }
  };
  
  return {
    editOpen,
    selectedOrderId,
    selectedPayment,
    handleEditClick,
    handleEditClose,
    handlePaymentChange,
    handleSubmit
  };
};