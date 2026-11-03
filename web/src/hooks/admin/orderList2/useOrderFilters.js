import { useState } from 'react';
import { filterOrders } from '../../../utils/orderUtils2';

export const useOrderFilters = (orders) => {
  const [filteredStatus, setFilteredStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Handle status tab change
  const handleStatusChange = (event, newValue) => {
    /* console.log("Status changed to:", newValue); */
    
    setFilteredStatus(newValue);
  };
  
  // Handle search input change
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle date filter changes
  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);
  
  // Get filtered orders based on current filters
  const filteredOrders = filterOrders(orders, filteredStatus, searchQuery, startDate, endDate);
  
  return {
    filteredStatus,
    searchQuery,
    startDate,
    endDate,
    filteredOrders,
    handleStatusChange,
    handleSearch,
    handleStartDateChange,
    handleEndDateChange
  };
};