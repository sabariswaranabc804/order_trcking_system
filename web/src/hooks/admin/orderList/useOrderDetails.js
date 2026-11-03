import { useState } from 'react';
import { fetchOrderDetails } from '../../../service/admin/orderService';

export const useOrderDetails = () => {
  const [selectedOrder, setSelectedOrder] = useState(1);
  const [orderData, setOrderData] = useState(null);
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  
  // Handle opening order details dialog
  const handleOrderClick = async (orderId) => {
    setSelectedOrder(orderId);
    setOpen(true);

    try {
      const { order, products } = await fetchOrderDetails(orderId);
      setOrderData(order);
      setProducts(products);
    } catch (error) {
      // Error handling is done in the service
    }
  };
  
  // Handle closing order details dialog
  const handleClose = () => {
    setOpen(false);
    setOrderData(null);
    setProducts([]);
  };
  
  return {
    selectedOrder,
    orderData,
    products,
    open,
    handleOrderClick,
    handleClose
  };
};