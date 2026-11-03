import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../../context/CartContext';
import { useProfile } from './useProfile';
import { useAuth } from '../../context/AuthContext';
import { fetchAddresses, deleteAddress } from '../../service/user/addressService';
import { processOrder as processOrderService } from '../../service/user/orderService';
import { createRazorpayOrder, verifyRazorpayPayment } from '../../service/user/paymentService';
import ClipboardJS from 'clipboard';

const useDeliveryAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('offline');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [showAllAddresses, setShowAllAddresses] = useState(false);
  const [copied, setCopied] = useState(false);

  const navigate = useNavigate();
  const { cartItems, dispatch } = useCart();
  const { user } = useProfile();
  const { user: users } = useAuth();
  const userId = users?.user_code;
  const totalPrice = Number(localStorage.getItem('totalPrice'));
  const totalquantity = localStorage.getItem('totalQuantity');
  const gpayNumber = "9159079191";

  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };
    loadRazorpayScript();
  }, []);

  useEffect(() => {
    const getAddresses = async () => {
      if (userId) {
        try {
          const data = await fetchAddresses(userId);
          setAddresses(data);
        } catch (error) {
          toast.error('Error fetching addresses');
        }
      }
    };
    getAddresses();
  }, [userId]);

  useEffect(() => {
    const clipboard = new ClipboardJS('.copy-button', {
      text: () => gpayNumber,
    });

    clipboard.on('success', () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });

    clipboard.on('error', () => {
      alert('Failed to copy text');
    });

    return () => {
      clipboard.destroy();
    };
  }, [gpayNumber]);

  const handleCardClick = (path) => {
    const addressId = addresses[selectedAddress].AddressId;
    const selectedAddressData = addresses[selectedAddress];
    navigate(path, { state: { address: selectedAddressData } });
  };

  const handleDelete = async () => {
    const addressId = addresses[selectedAddress].AddressId;
    try {
      await deleteAddress(userId, addressId);
      window.location.reload();
      toast.info("Address deleted successfully...!");
    } catch (error) {
      toast.error('Error deleting address');
    }
  };

  const processOrder = async (paymentType, paymentId = null, razorpay_order_id = null) => {
    const addressId = addresses[selectedAddress].AddressId;

    try {
      const orderData = {
        cartItems,
        totalPrice,
        addressId,
        userId,
        orderStatus_Id: 0,
        totalquantity,
        payment: paymentType,
        paymentId: paymentId,
        razorpay_order_id: razorpay_order_id,
        userPhoneNumber: user.mobile_Number,
      };
      const response = await processOrderService(orderData);

      cartItems.forEach(item => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: { id: item.servSubType_Id } });
      });

      localStorage.removeItem('totalPrice');
      localStorage.removeItem('totalQuantity');

      navigate('/user');
      toast.success(`Order processed successfully! Order ID: ${response.orderId}`);
    } catch (error) {
      toast.error('Error placing order: ' + (error.response?.data?.error || 'Unknown error'));
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      const orderResponse = await createRazorpayOrder(totalPrice);

      const options = {
        key: 'rzp_live_bF3uU9wS3BP1N2',
        amount: totalPrice * 100,
        currency: 'INR',
        name: 'Kirush Laundry',
        description: 'Payment for laundry services',
        order_id: orderResponse.id,
        handler: async function (response) {
          try {
            const verifyResponse = await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyResponse.success) {
              processOrder('razorpay', response.razorpay_payment_id, response.razorpay_order_id);
            } else {
              toast.error('Payment verification failed');
              setPaymentProcessing(false);
            }
          } catch (error) {
            toast.error('Error verifying payment');
            setPaymentProcessing(false);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.mobile_Number || '',
        },
        notes: {
          address: 'Kirush Laundry Office'
        },
        theme: {
          color: '#3399cc'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

      razorpay.on('payment.failed', function (response) {
        toast.error('Payment failed: ' + response.error.description);
        setPaymentProcessing(false);
      });
    } catch (error) {
      toast.error('Error initiating payment: ' + (error.response?.data?.message || 'Unknown error'));
      setPaymentProcessing(false);
    }
  };

  const handleSubmitOrder = () => {
    // Prevent multiple clicks
    if (paymentProcessing) return;
    
    // Validate address selection
    if (selectedAddress === null) {
      toast.warn('Please select a delivery address.');
      return;
    }
    
    // Validate payment method selection
    if (!paymentMethod) {
      toast.warn('Please select a payment method.');
      return;
    }
    
    setPaymentProcessing(true);
    
    if (paymentMethod === 'offline') {
      processOrder('offline');
    } else if (paymentMethod === 'online') {
      handleRazorpayPayment();
    } else if (paymentMethod === 'verify') {
      processOrder('verify');
    }
  };

  const toggleShowAll = () => {
    setShowAllAddresses((prev) => !prev);
  };

  const displayedAddresses = showAllAddresses ? addresses : addresses.slice(0, 2);
  const gpayLink = `upi://pay?pa=9159079191@okbizaxis&pn=kirush%20Laundry&am=${totalPrice}&cu=INR&tn=${encodeURIComponent(`UserId# ${userId}`)}`;

  return {
    addresses,
    selectedAddress,
    setSelectedAddress,
    showQRCode,
    setShowQRCode,
    paymentMethod,
    setPaymentMethod,
    paymentProcessing,
    showAllAddresses,
    toggleShowAll,
    displayedAddresses,
    handleCardClick,
    handleDelete,
    handleSubmitOrder,
    gpayLink,
    gpayNumber,
    copied,
    totalPrice,
  };
};

export default useDeliveryAddress;