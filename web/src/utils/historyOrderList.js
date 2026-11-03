// Function to get status color based on status name
export const getStatusColor = (status) => {
  switch (status) {
    case 'PICKUP_ASSIGNED':
      return 'rgba(245, 113, 0, 1)';
    case 'DELIVERY_ASSIGNED':
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

// Function to open Google Maps with coordinates or address
export const openGoogleMaps = (longitude, latitude, address) => {
  if (longitude === 0 || latitude === 0) {
    const googleMapsUrl = `${address}`;
    window.open(googleMapsUrl, '_blank');
    return;
  }
  
  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
  window.open(googleMapsUrl, '_blank');
};

// Function to dial a phone number
export const dialPhoneNumber = (phoneNumber) => {
  if (phoneNumber) {
    window.open(`tel:${phoneNumber}`);
  } else {
    alert('Phone number not available!');
  }
};

// Function to filter orders based on status, search query, and date range
export const filterOrders = (orders, filteredStatus, searchQuery, startDate, endDate) => {
  return orders.filter(order => {
    return (
      (filteredStatus === 'All' || order.orderStatus_Id == filteredStatus) &&
      (order.user_Name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
       (order.payment?.toLowerCase()?.includes(searchQuery.toLowerCase()) || 
        order.order_id.toString().includes(searchQuery))) &&
      (!startDate || !endDate || 
       (new Date(order.order_date) >= new Date(startDate) && new Date(order.order_date) <= new Date(endDate)))
    );
  });
};

// Function to format payment status for display
export const formatPaymentStatus = (payment) => {
  switch (payment) {
    case 'offline':
      return 'COD';
    case 'online':
      return 'Verify';
    case 'paid':
      return 'Paid';
    default:
      return 'COD';
  }
};

// Function to create a GPay link
export const createGPayLink = (orderId, amount) => {
  const transactionNote = `orderId# ${orderId}`;
  return `upi://pay?pa=9159079191@okbizaxis&pn=kirush%20Laundry&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
};