import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import {
  fetchPendingOrders,
  fetchDeliverymen,
  fetchAssignedOrders,
  updateOrderToReadyDrop,
  updateOrderToCompleted,
  fetchOrderDetails,
  acceptOrder
} from '../../service/anchor/takeOrderService';
import { filterOrders } from '../../utils/takeOrderUtils';

const useTakeOrder = () => {
  const [orders, setOrders] = useState([]);
  const [pendingOrder, setPendingOrders] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState('Assign By Admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(1);
  const [assignedAnchors, setAssignedAnchors] = useState({});
  const [products, setProducts] = useState([]);
  const [orderData, setOrderData] = useState(null);
  const [deliveryman, setDeliveryman] = useState([]);
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { user: userDetails } = useAuth();

  /* console.log("userdetails", userDetails); */

  const companyId = userDetails?.company_Id;
  const deliverymanId = userDetails?.deliveryman_id;

  // Function to handle tab change
  const handleStatusChange = (event, newValue) => {
    setFilteredStatus(newValue);
    /* console.log("Status changed to:", newValue); */

    // Fetch pending orders if the "Pending" tab or "Ready to Drop" tab is clicked
    if (newValue === 'Pending' || newValue === 'Ready to Drop') {
      fetchPendingOrdersData();
    }
  };

  // Function to fetch pending orders
  const fetchPendingOrdersData = async () => {
    try {
      const data = await fetchPendingOrders();
      setPendingOrders(data);
    } catch (error) {
      setError('Error fetching pending orders');
    }
  };

  // Fetch deliverymen
  useEffect(() => {
    const getDeliverymen = async () => {
      if (companyId) {
        try {
          const data = await fetchDeliverymen(companyId);
          setDeliveryman(data);
        } catch (err) {
          setError('Error fetching deliverymen');
        }
      }
    };

    getDeliverymen();
  }, [companyId]);

  // Fetch orders
  useEffect(() => {
    const getOrders = async () => {
      if (deliverymanId) {
        try {
          const data = await fetchAssignedOrders(deliverymanId);
          setOrders(data);
          setLoading(false);
        } catch (err) {
          setError('Error fetching orders');
          setLoading(false);
        }
      }
    };

    getOrders();
  }, [deliverymanId]);

  // Fetch pending orders when component mounts
  useEffect(() => {
    fetchPendingOrdersData();
  }, []);

  // Handle order status updates
  const handleGetReadyDrop = async (orderId) => {
    try {
      const response = await updateOrderToReadyDrop(orderId);
      alert(response.message);
      navigate('/');
    } catch (error) {
      setError('Error updating order to Ready to Drop');
    }
  };

  const handleSetCompleted = async (orderId) => {
    try {
      const response = await updateOrderToCompleted(orderId);
      alert(response.message);
      navigate('/');
    } catch (error) {
      setError('Error updating order to Completed');
    }
  };

  // Handle search input change
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle order click to show details
  const handleOrderClick = async (orderId) => {
    setSelectedOrder(orderId);
    setOpen(true);

    try {
      const { order, products } = await fetchOrderDetails(orderId);
      setOrderData(order);
      setProducts(products);
    } catch (error) {
      setError('Error fetching order details');
    }
  };

  // Handle dialog close
  const handleClose = () => {
    setOpen(false);
    setOrderData(null);
    setProducts([]);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  // Function to refresh all data
  const refreshData = async () => {
    try {
      /* console.log('Starting data refresh...'); */
      setLoading(true);

      // Refresh assigned orders
      if (deliverymanId) {
        /* console.log('Fetching assigned orders for deliverymanId:', deliverymanId); */
        const ordersData = await fetchAssignedOrders(deliverymanId);
        /* console.log('Fetched assigned orders:', ordersData); */
        setOrders(ordersData);
      }

      // Refresh pending orders
      /* console.log('Fetching pending orders...'); */
      const pendingData = await fetchPendingOrders();
      /* console.log('Fetched pending orders:', pendingData); */
      setPendingOrders(pendingData);

      setLoading(false);
      /* console.log('Data refresh completed'); */
    } catch (error) {
      /* console.error('Error refreshing data:', error); */
      setError('Error refreshing data');
      setLoading(false);
    }
  };

  // Handle accepting an order
  const handleSendTaskToAnchor = async (orderId) => {
    try {
      /* console.log('Accepting order:', orderId); */
      const response = await acceptOrder(orderId, deliverymanId);
      /* console.log('Accept order response:', response); */

      // Check if the response indicates success
      if (response && (response.success || response.message)) {
        toast.info('Order accepted successfully!');
        /* console.log('Order accepted, refreshing data...'); */
        // Refresh all data after accepting
        await refreshData();
      } else {
        // If response doesn't indicate success, still try to refresh
        toast.info('Order accepted successfully!');
        await refreshData();
      }
    } catch (error) {
      /* console.error('Error accepting order:', error); */
      alert('Failed to accept the order.');
    }
  };

  // Handle date range changes
  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);

  // Filter orders based on status, search query, and date range
  const filteredOrders = filterOrders(orders, pendingOrder, filteredStatus, searchQuery, startDate, endDate);

  // Calculate counts for each tab
  const getOrderCounts = () => {
    const assignByAdminCount = filterOrders(orders, pendingOrder, 'Assign By Admin', '', '', '').length;
    const confirmedCount = filterOrders(orders, pendingOrder, 'CONFIRMED', '', '', '').length;
    const readyForDeliveryCount = filterOrders(orders, pendingOrder, 'READY_FOR_DELIVERY', '', '', '').length;

    return {
      assignByAdmin: assignByAdminCount,
      confirmed: confirmedCount,
      readyForDelivery: readyForDeliveryCount
    };
  };

  const orderCounts = getOrderCounts();

  return {
    orders,
    pendingOrder,
    filteredStatus,
    searchQuery,
    selectedOrder,
    assignedAnchors,
    products,
    orderData,
    deliveryman,
    open,
    startDate,
    endDate,
    loading,
    error,
    filteredOrders,
    orderCounts,
    deliverymanId,
    companyId,
    refreshData,
    handleStatusChange,
    handleGetReadyDrop,
    handleSetCompleted,
    handleSearch,
    handleOrderClick,
    handleClose,
    handleDialogClose,
    handleSendTaskToAnchor,
    handleStartDateChange,
    handleEndDateChange,
  };
};

export default useTakeOrder;