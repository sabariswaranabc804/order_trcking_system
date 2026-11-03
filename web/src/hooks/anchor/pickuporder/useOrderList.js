import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { fetchDeliverymen, fetchAllOrders } from '../../../service/anchor/pickupOrderService';
import { filterOrders } from '../../../utils/pickupOrderUtils';

const useOrderList = () => {
  const { user: userDetails } = useAuth();
  const companyId = userDetails?.company_Id;
  const deliverymanId = userDetails?.deliveryman_id;
  
  const [orders, setOrders] = useState([]);
  const [deliveryman, setDeliveryman] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch deliverymen
  useEffect(() => {
    const getDeliverymen = async () => {
      if (companyId) {
        try {
          const data = await fetchDeliverymen(companyId);
          setDeliveryman(data);
        } catch (err) {
          setError(err.message);
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
          const data = await fetchAllOrders(deliverymanId);
          setOrders(data);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      }
    };
    
    getOrders();
  }, [deliverymanId]);
  
  // Function to refresh all data
  const refreshData = async () => {
    try {
      /* console.log('Starting data refresh...'); */
      setLoading(true);

      // Refresh orders
      if (deliverymanId) {
        /* console.log('Fetching orders for deliverymanId:', deliverymanId); */
        const ordersData = await fetchAllOrders(deliverymanId);
        /* console.log('Fetched orders:', ordersData); */
        setOrders(ordersData);
      }

      // Refresh deliverymen
      if (companyId) {
        /* console.log('Fetching deliverymen for companyId:', companyId); */
        const deliverymenData = await fetchDeliverymen(companyId);
        /* console.log('Fetched deliverymen:', deliverymenData); */
        setDeliveryman(deliverymenData);
      }

      setLoading(false);
      /* console.log('Data refresh completed'); */
    } catch (error) {
      /* console.error('Error refreshing data:', error); */
      setError('Error refreshing data');
      setLoading(false);
    }
  };

  // Filter orders based on status, search query, and date range
  const filteredOrders = filterOrders(orders, filteredStatus, searchQuery, startDate, endDate);
  
  // Calculate counts for each tab
  const getOrderCounts = () => {
    const allCount = filterOrders(orders, 'All', '', '', '').length;
    const pickCount = filterOrders(orders, '2', '', '', '').length; // orderStatus_Id == 2
    const dropCount = filterOrders(orders, '6', '', '', '').length; // orderStatus_Id == 6
    
    return {
      all: allCount,
      pick: pickCount,
      drop: dropCount
    };
  };
  
  const orderCounts = getOrderCounts();
  
  // Handle status change
  const handleStatusChange = (event, newValue) => {
    setFilteredStatus(newValue);
  };
  
  // Handle search input change
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle date range changes
  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);
  
  return {
    orders,
    deliveryman,
    filteredStatus,
    searchQuery,
    startDate,
    endDate,
    loading,
    error,
    filteredOrders,
    orderCounts,
    deliverymanId,
    refreshData,
    handleStatusChange,
    handleSearch,
    handleStartDateChange,
    handleEndDateChange,
  };
};

export default useOrderList;