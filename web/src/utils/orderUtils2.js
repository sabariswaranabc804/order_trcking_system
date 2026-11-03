// Get color based on order status
export const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'rgba(245, 113, 0, 1)';
      case 'CONFIRMED':
        return 'rgba(1, 135, 117, 1)';
      case 'PICKUP_ASSIGNED':
        return 'rgba(255, 0, 189, 1)';
      case 'PICKED_UP':
        return 'rgba(0, 157, 255, 1)';
      case 'IN_PROCESSING':
        return 'rgba(33, 176, 47, 1)';
      case 'READY_FOR_DELIVERY':
        return 'rgba(0, 13, 255, 1)';
         case 'DELIVERY_ASSIGNED':
        return 'rgba(185, 1, 176, 1)';
         case 'OUT_FOR_DELIVERY':
        return 'rgba(0, 96, 175, 1)';
         case 'DELIVERED':
        return 'rgba(1, 148, 58, 1)';
          case 'CANCELLED':
        return 'rgba(161, 17, 17, 1)';
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
    if (payment.toLowerCase() === "offline") {
      return "COD";
    } else if (payment.toLowerCase() === "online") {
      return "Verify";
    } else if (payment.toLowerCase() === "paid") {
      return "Paid";
    } else {
      return "COD";
    }
  };
  
  // Open Google Maps with coordinates or address
  export const openGoogleMaps = (longitude, latitude, address) => {
    if (longitude === 0 || latitude === 0) {
      const googleMapsUrl = `${address}`;
      window.open(googleMapsUrl, '_blank');
      return;
    }
    
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(googleMapsUrl, '_blank');
  };
  
  // Dial phone number
  export const dialPhoneNumber = (phoneNumber) => {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`);
    } else {
      alert('Phone number not available!');
    }
  };