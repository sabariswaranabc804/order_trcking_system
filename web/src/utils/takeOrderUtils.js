// Function to get status color based on status name
export const getStatusColor = (status) => {
  switch (status) {
    case 'CONFIRMED':
      return 'rgba(245, 113, 0, 1)';
    case 'READY_FOR_DELIVERY':
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

// Function to copy phone number to clipboard
export const copyPhoneNumber = (phoneNumber) => {
  navigator.clipboard.writeText(phoneNumber)
    .then(() => {
      alert('Phone number copied to clipboard!');
    })
    .catch((err) => {
      /* console.error('Failed to copy phone number: ', err); */
    });
};

// Function to filter orders based on status, search query, and date range
export const filterOrders = (orders, pendingOrders, filteredStatus, searchQuery, startDate, endDate) => {
  const sourceOrders = (filteredStatus === 'Pending' || filteredStatus === 'Ready to Drop') ? pendingOrders : orders;
  
  return sourceOrders.filter(order => {
    return (
      (filteredStatus === 'Assign By Admin' || order.StatusText === filteredStatus) &&
      (order.user_Name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       order.order_id.toString().includes(searchQuery) ||
       order.email_Id.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!startDate || !endDate || 
       (new Date(order.order_date) >= new Date(startDate) && new Date(order.order_date) <= new Date(endDate)))
    );
  });
};