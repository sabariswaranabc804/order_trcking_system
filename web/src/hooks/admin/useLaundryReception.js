import { useState, useEffect, useRef } from 'react';
import { fetchCustomers, fetchServiceSubTypes, fetchUserAddresses, submitOrder } from '../../service/admin/laundryReceptionService';
import Swal from 'sweetalert2';

const useLaundryReception = () => {
  // User selection states
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedUserPhoneNumber, setSelectedUserPhoneNumber] = useState();
  const [userError, setUserError] = useState(false);

  // Address states
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState('');

  // Service and items states
  const [serviceType, setServiceType] = useState('DRY CLEAN');
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // QR code and payment states
  const [qrData, setQrData] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('Paid');
  const [orderServiceType, setOrderServiceType] = useState('self-service');

  // Data fetching states
  const [customer, setCustomer] = useState([]);
  const [service, setService] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ref for input focus
  const userRef = useRef(null);

  // Fetch customers on component mount
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await fetchCustomers();
        setCustomer(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  // Focus on user input field when component mounts
  useEffect(() => {
    userRef.current?.focus();
  }, []);

  // Fetch service subtypes on component mount
  useEffect(() => {
    const loadServiceSubTypes = async () => {
      try {
        const data = await fetchServiceSubTypes();
        setService(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadServiceSubTypes();
  }, []);

  // Calculate total price whenever selected items change
  useEffect(() => {
    const newTotalPrice = selectedItems.reduce((sum, item) => sum + item.rate * item.quantity, 0);
    setTotalPrice(newTotalPrice);

    // Auto-regenerate QR code if it exists and total price changes
    if (qrData && newTotalPrice > 0) {
      setQrData(
        `User: ${selectedUser}, Service: ${orderServiceType}, Items: ${JSON.stringify(
          selectedItems
        )}, Total: ₹${newTotalPrice}`
      );
    }
  }, [selectedItems, selectedUser, orderServiceType, qrData]);

  // Format customer data for autocomplete
  const users = customer.map(user => ({
    label: `${user.user_Name} - Ph(${user.mobile_Number})`,
    id: user.user_Code,
    phoneNumber: user.mobile_Number
  }));

  // Group service items by category
  const serviceItems = service.reduce((acc, service) => {
    const category = service.serv_Name || 'Unknown';
    if (!acc[category]) acc[category] = [];
    acc[category].push({
      id: service.servSubType_Id,
      servSubType_Name: service.servSubType_Name,
      serv_Name: service.serv_Name,
      rate: service.rate || 0,
    });
    return acc;
  }, {});

  // Handle user selection
  const handleUserChange = async (event, newInputValue) => {
    const selectedUser = users.find(user => user.label === newInputValue);

    setSelectedUser(newInputValue);
    /* console.log("se",selectedUser); */
    
    setSelectedUserId(selectedUser ? selectedUser.id : '');
    setSelectedUserPhoneNumber(selectedUser ? selectedUser.phoneNumber : '');
    setUserError(!selectedUser && newInputValue !== '');

    // Fetch addresses when user is selected
    if (selectedUser && selectedUser.id) {
      try {
        const addresses = await fetchUserAddresses(selectedUser.id);
        setUserAddresses(addresses);
        // Reset address selection
        setSelectedAddress('');
        setSelectedAddressId('');
      } catch (error) {
        /* console.error('Error fetching user addresses:', error); */
        setUserAddresses([]);
      }
    } else {
      setUserAddresses([]);
      setSelectedAddress('');
      setSelectedAddressId('');
    }
  };

  // Handle service type selection
  const handleServiceChange = (event) => {
    setServiceType(event.target.value);
  };

  // Handle item selection
  const handleItemClick = (item) => {
    setSelectedItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  // Handle quantity changes
  const handleQuantityChange = (id, delta) => {
    setSelectedItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        )
    );
  };

  // Handle item deletion
  const handleDeleteItem = (id) => {
    setSelectedItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Generate QR code
  const generateQRCode = () => {
    setQrData(
      `User: ${selectedUser}, Service: ${orderServiceType}, Items: ${JSON.stringify(
        selectedItems
      )}, Total: ₹${totalPrice}`
    );
  };

  // Cancel QR code
  const cancelQRCode = () => {
    setQrData('');
  };

  // Handle address selection
  const handleAddressChange = (event, newInputValue) => {
    // Format addresses to match the component's formatting
    const formattedAddresses = userAddresses.map(address => ({
        label: `${address.AddressType || 'Address'} - ${address.city_Id || ''}- ${address.Area || ''}-${address.Street || ''} -${address.Floor_Door_no || ''} -${address.Landmark || ''} -  ${address.pin_Code || ''}`.trim(),
      ...address
    }));
    /* console.log("new",newInputValue); */
    
    /* console.log("format",formattedAddresses,newInputValue); */
    
    const selectedAddr = formattedAddresses.find(addr => addr.label === newInputValue);
    setSelectedAddress(newInputValue);
    setSelectedAddressId(selectedAddr ? selectedAddr.AddressId : '');

    /* console.log("Selected Address:", newInputValue); */
    /* console.log("Selected Address ID:", selectedAddr ? selectedAddr.AddressId : ''); */
  };


  // Handle order submission
  const handleOrderSubmit = async (event) => {
    event.preventDefault();

    if (!selectedUserId) {
      setUserError(true);
      return;
    }
    if (!selectedUserId || userError) {
      Swal.fire({
        icon: 'error',
        title: 'User Not Found',
        text: 'Please select a valid user before placing the order.',
      });
      return;
    }

    /* console.log("select id", selectedAddressId); */


    // Validate address selection for one-way orders
    if (orderServiceType === 'one-way' && !selectedAddressId) {
      Swal.fire({
        icon: 'error',
        title: 'Address Required',
        text: 'Please select a delivery address for one-way service.',
      });
      return;
    }

    const totalQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

    try {
      const orderData = {
        cartItems: selectedItems,
        totalPrice,
        addressId: selectedAddressId || 1,
        address: selectedAddress || "USRNaN",
        orderStatus_Id: 3,
        userId: selectedUserId,
        totalquantity: totalQuantity,
        payment: paymentStatus,
        userPhoneNumber: selectedUserPhoneNumber,
        orderType: orderServiceType
      };

      await submitOrder(orderData);

      // Reset form fields
      setSelectedUser('');
      setSelectedUserId('');
      setSelectedUserPhoneNumber('');
      setUserError(false);
      setServiceType('DRY CLEAN');
      setSelectedItems([]);
      setTotalPrice(0);
      setQrData('');
      setPaymentStatus('Paid');
      setOrderServiceType('self-service');
      setUserAddresses([]);
      setSelectedAddress('');
      setSelectedAddressId('');

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Order submitted successfully!',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error placing order: ${error.response?.data?.error || 'Unknown error'}`,
      });
    }
  };

  return {
    // State
    selectedUser,
    selectedUserId,
    selectedItems,
    totalPrice,
    qrData,
    paymentStatus,
    serviceType,
    orderServiceType,
    userError,
    loading,
    error,
    userAddresses,
    selectedAddress,
    selectedAddressId,

    // Data
    users,
    serviceItems,

    // Refs
    userRef,

    // Handlers
    handleUserChange,
    handleServiceChange,
    handleItemClick,
    handleQuantityChange,
    handleDeleteItem,
    handleOrderSubmit,
    generateQRCode,
    cancelQRCode,
    setPaymentStatus,
    setOrderServiceType,
    handleAddressChange
  };
};

export default useLaundryReception;