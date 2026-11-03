import { useState } from 'react';
import { fetchOrderDetails, rejectOrder } from '../../../service/anchor/pickupOrderService';
import { createGPayLink } from '../../../utils/pickupOrderUtils';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const useOrderDetails = (deliverymanId) => {
  const [selectedOrder, setSelectedOrder] = useState(1);
  const [orderData, setOrderData] = useState(null);
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [gpayLink, setGpayLink] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('offline');
  const [copied, setCopied] = useState(false);
  
  // Handle order click to show details
  const handleOrderClick = async (orderId, totalAmt = 0) => {
    setSelectedOrder(orderId);
    setOpen(true);
    
    // Create GPay link
    const link = createGPayLink(orderId, totalAmt);
    setGpayLink(link);
    
    try {
      const { order, products } = await fetchOrderDetails(orderId);
      setOrderData(order);
      setProducts(products);
    } catch (error) {
      /* console.error('Error fetching order details:', error); */
    }
  };
  
  // Handle dialog close
  const handleClose = () => {
    setOpen(false);
    setOrderData(null);
    setProducts([]);
  };
  
  // Handle payment method change
  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };
  
  // Handle payment click
  const handlePaymentClick = () => {
    if (paymentMethod === 'online') {
      setShowQRCode(true);
    } else {
      alert("Please proceed with the offline payment.");
      setShowQRCode(false);
    }
  };
  
  // Handle order rejection
  const handleRejectOrder = async (orderId, statusName) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Reject it!',
      cancelButtonText: 'No, keep it'
    });
    
    if (result.isConfirmed) {
      try {
        await rejectOrder(orderId, statusName);
        
        Swal.fire(
          'Cancelled!',
          'Your order has been Rejected.',
          'success'
        );
        
        toast.info('Order rejected and status updated successfully');
      } catch (error) {
        alert('Failed to reject order');
      }
    }
  };
  
  return {
    selectedOrder,
    orderData,
    products,
    open,
    gpayLink,
    showQRCode,
    paymentMethod,
    copied,
    gpayNumber: "9786172510",
    handleOrderClick,
    handleClose,
    handlePaymentMethodChange,
    handlePaymentClick,
    handleRejectOrder,
    setCopied,
  };
};

export default useOrderDetails;