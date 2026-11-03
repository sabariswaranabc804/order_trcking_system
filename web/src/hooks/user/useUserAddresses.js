import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {deleteAddress, fetchAddresses} from '../../service/user/addressService';

export const useUserAddresses = (userId) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAllAddresses, setShowAllAddresses] = useState(false);

  useEffect(() => {
    const getAddresses = async () => {
      try {
        const data = await fetchAddresses(userId);
        setAddresses(data);
      } catch (error) {
        toast.error('Error fetching addresses');
      }
    };

    if (userId) {
      getAddresses();
    }
  }, [userId]);

  const toggleShowAll = () => {
    setShowAllAddresses((prev) => !prev);
  };

  const deleteByAddress = async () => {
    if (selectedAddress === null) return;
    try {
      await deleteAddress(userId, addresses[selectedAddress].AddressId);
      toast.info('Address deleted successfully');
      setAddresses((prev) => prev.filter((_, idx) => idx !== selectedAddress));
      setSelectedAddress(null);
    } catch (error) {
      toast.error('Error deleting address');
    }
  };

  return {
    addresses,
    selectedAddress,
    setSelectedAddress,
    showAllAddresses,
    toggleShowAll,
    deleteByAddress
  };
};
