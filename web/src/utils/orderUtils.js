// Utility functions for orders

// Get color based on order status
export const getStatusColor = (status) => {
  switch (status) {
    case 'Pending':
      return 'rgba(245, 113, 0, 1)';
    case 'Ready to Pick':
      return 'rgba(1, 135, 117, 1)';
    case 'Pick':
      return 'rgba(255, 0, 189, 1)';
    case 'Drop':
      return 'rgba(0, 157, 255, 1)';
    case 'Completed':
      return 'rgba(33, 176, 47, 1)';
    case 'Ready to Drop':
      return 'rgba(0, 13, 255, 1)';
    default:
      return 'red';
  }
};

// Filter orders based on criteria
export const filterOrders = (orders, filteredStatus, searchQuery, startDate, endDate) => {
  return orders.filter(order => 
    (filteredStatus === 'All' || order.status_Name === filteredStatus) &&
    (order.user_Name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     order.email_Id.toLowerCase().includes(searchQuery.toLowerCase()) || 
     (order.payment?.toLowerCase()?.includes(searchQuery.toLowerCase()))) &&
    (!startDate || !endDate || (new Date(order.order_date) >= new Date(startDate) && 
                               new Date(order.order_date) <= new Date(endDate)))
  );
};

// Format payment status for display
export const formatPaymentStatus = (payment) => {
  if (payment === "Pending") {
    return "COD";
  } else if (payment === "Paid") {
    return "Paid";
  } else {
    return "COD";
  }
};