import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { 
  fetchAllOrders, 
  fetchDeliverymen, 
  updateOrderToReadyToDrop, 
  updateOrderToCompleted,
  assignDeliverymenToOrder,
  fetchRejectedOrders
} from '../../../service/admin/orderService2';

export const useOrderManagement = (companyId) => {
  const [orders, setOrders] = useState([]);
  const [deliveryman, setDeliveryman] = useState([]);
  const [assignedAnchors, setAssignedAnchors] = useState({});
  const [rejectorder, setRejectorders] = useState([]);
  
  // Function to refresh orders
  const refreshOrders = useCallback(async () => {
    try {
      /* console.log("Refreshing orders..."); */
      const data = await fetchAllOrders("two-way");
      /* console.log("Orders refreshed:", data.length); */
      /* console.log("Orders",data); */
      setOrders(data);
      return data;
    } catch (error) {
      /* console.error("Error refreshing orders:", error); */
      throw error;
    }
  }, []); // Empty dependency array means this function won't change
  
  // Fetch all orders
  useEffect(() => {
    refreshOrders();
  }, []);
  
  // Fetch deliverymen
  useEffect(() => {
    const getDeliverymen = async () => {
  
      
      try {
        const data = await fetchDeliverymen(companyId);
        setDeliveryman(data);
      } catch (error) {
        // Error handling is done in the service
      }
    };
    
    getDeliverymen();
  }, []);
  
  // Fetch rejected orders
  useEffect(() => {
    const getRejectedOrders = async () => {
      try {
        const data = await fetchRejectedOrders();
        setRejectorders(data);
      } catch (error) {
        // Error handling is done in the service
      }
    };
    
    getRejectedOrders();
  }, []);
  
  // Handle setting order to ready to drop
  const handleGetReadyDrop = async (orderId) => {
    try {
      const response = await updateOrderToReadyToDrop(orderId);
      toast.info(response.message);
      // Refresh orders after update
      const updatedOrders = await fetchAllOrders();
      setOrders(updatedOrders);
    } catch (error) {
      // Error handling is done in the service
    }
  };
  
  // Handle setting order to completed
  const handleSetCompleted = async (orderId) => {
    try {
      const response = await updateOrderToCompleted(orderId);
      toast.info(response.message);
      // Refresh orders after update
      const updatedOrders = await fetchAllOrders();
      setOrders(updatedOrders);
    } catch (error) {
      // Error handling is done in the service
    }
  };
  
  // Handle sending task to anchor/deliveryman
  const handleSendTaskToAnchor = async (orderId, statusName,admin_id) => {
    const selectedAnchors = assignedAnchors[orderId];
    
    if (selectedAnchors && selectedAnchors.length > 0) {
      const deliverymanIds = selectedAnchors.map(anchor => anchor.deliveryman_id);
      
      try {
        const response = await assignDeliverymenToOrder(orderId, statusName, deliverymanIds,admin_id);
        toast.info('Task assigned successfully:', response);
        setAssignedAnchors({});
        // Refresh orders after update
        const updatedOrders = await fetchAllOrders();
        setOrders(updatedOrders);
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: error.response?.data?.message || 'An error occurred while assigning the task to the deliveryman.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    }
  };
  
  return {
    orders,
    deliveryman,
    assignedAnchors,
    rejectorder,
    setAssignedAnchors,
    handleGetReadyDrop,
    handleSetCompleted,
    handleSendTaskToAnchor,
    refreshOrders  // Export the refresh function
  };
};