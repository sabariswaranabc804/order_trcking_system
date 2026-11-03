import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchDeliverymen, fetchAllOrders } from '../../service/anchor/historyservice';
import { filterOrders } from '../../utils/historyOrderList';

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
  
  // Filter orders based on status, search query, and date range
  const filteredOrders = filterOrders(orders, filteredStatus, searchQuery, startDate, endDate);
  /* console.log("his",orders); */
  
  // Calculate counts for each tab
  const getOrderCounts = () => {
    /* console.log('Calculating order counts...'); */
    /* console.log('Total orders:', orders.length); */
    /* console.log('Orders data:', orders); */
    
    const allCount = filterOrders(orders, 'All', '', '', '').length;
    const pickedCount = filterOrders(orders, '3', '', '', '').length; // orderStatus_Id == 3 (Picked)
    const droppedCount = filterOrders(orders, '7', '', '', '').length; // orderStatus_Id == 7 (Dropped)
    
    /* console.log('All count:', allCount); */
    /* console.log('Picked count (status 3):', pickedCount); */
    /* console.log('Dropped count (status 7):', droppedCount); */
    
    // Let's also check what orderStatus_Id values we actually have
    const statusIds = orders.map(order => order.orderStatus_Id);
    /* console.log('Available orderStatus_Id values:', [...new Set(statusIds)]); */
    
    return {
      all: allCount,
      picked: pickedCount,
      dropped: droppedCount
    };
  };
  
  const orderCounts = getOrderCounts();
  /* console.log("ord",orderCounts); */
  
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
    handleStatusChange,
    handleSearch,
    handleStartDateChange,
    handleEndDateChange,
  };
};

export default useOrderList;