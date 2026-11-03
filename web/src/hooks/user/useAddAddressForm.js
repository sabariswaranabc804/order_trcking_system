import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { addAddress, fetchPostOfficeData } from '../../service/user/addressService';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from './useProfile';

export const useAddAddressForm = (adminSelectedUserId = null, isAdminContext = false) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { user: userdetails } = useProfile();

  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [street, setStreet] = useState('');
  const [floorDoorNumber, setFloorDoorNumber] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState({ latitude: '', longitude: '' });
  const [pinCode, setPinCode] = useState('');
  const [landmark, setLandmark] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [postOffices, setPostOffices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPostOffice, setSelectedPostOffice] = useState('');

  useEffect(() => {
    if (userdetails) {
      setPhoneNumber(userdetails.mobile_Number);
    }
  }, [userdetails]);

  const userId = isAdminContext ? adminSelectedUserId : user?.user_code;

  useEffect(() => {
    if (pinCode && pinCode.length === 6) {
      handleFetchPostOfficeData(pinCode);
    } else {
      setPostOffices([]);
      setSelectedPostOffice('');
    }
  }, [pinCode]);

  const handleFetchPostOfficeData = async (pincode) => {
    setIsLoading(true);
    try {
      const data = await fetchPostOfficeData(pincode);
      if (data && data[0].Status === 'Success') {
        setPostOffices(data[0].PostOffice || []);
        toast.success(data[0].Message);
      } else {
        setPostOffices([]);
        toast.error('No data found for this pincode');
      }
    } catch (error) {
      toast.error('Failed to fetch location data');
      setPostOffices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostOfficeChange = (event) => {
    const selected = event.target.value;
    setSelectedPostOffice(selected);
    const postOfficeData = postOffices.find(po => po.Name === selected);
    if (postOfficeData) {
      setCountry(postOfficeData.Country || '');
      setState(postOfficeData.State || '');
      setCity(postOfficeData.District || '');
      setArea(postOfficeData.Name || '');
    }
  };

  const handleMapLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        toast.success('Location retrieved successfully!');
      }, error => {
        toast.error('Failed to get your location. Please try again.');
      });
    } else {
      toast.error('Geolocation is not supported by this browser.');
    }
  };

  const handleCancel = () => {
    setCountry('');
    setState('');
    setCity('');
    setArea('');
    setStreet('');
    setFloorDoorNumber('');
    setLandmark('');
    setPinCode('');
    setPhoneNumber('');
    setLocation({ latitude: '', longitude: '' });
  };

  const handleSubmit = async (selectedCoordinates = null) => {
    // Use coordinates from map picker if available
    const finalLocation = selectedCoordinates ? 
      { latitude: selectedCoordinates[0], longitude: selectedCoordinates[1] } : 
      location;

    const addressData = {
      userId,
      country,
      state,
      city,
      area,
      street,
      floorDoorNumber,
      landmark,
      pinCode,
      addressType: selectedValue,
      location: finalLocation,
      phoneNumber,
      address
    };
    let missingFields = [];
    if (!userId) missingFields.push('User ID');
    if (!country) missingFields.push('Country');
    if (!state) missingFields.push('State');
    if (!city) missingFields.push('City');
    if (!area) missingFields.push('Area');
    if (!street) missingFields.push('Street');
    if (!pinCode) missingFields.push('Pin Code');
    if (!floorDoorNumber) missingFields.push('Floor & Door Number');
    if (!landmark) missingFields.push('Landmark');
    if (!phoneNumber) missingFields.push('Phone Number');
    if (missingFields.length > 0) {
      Swal.fire({
        title: 'Missing Information',
        text: `Please fill in the following fields: ${missingFields.join(', ')}`,
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    } else if (!finalLocation.latitude && !address) {
      Swal.fire({
        title: 'Missing Information',
        text: 'Please choose a location using either "Use My Current Location" or "Choose Another Location".',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }
    try {
      await addAddress(addressData);
      if (isAdminContext) {
        // Clear session storage and navigate back to admin
        sessionStorage.removeItem('selectedUserId');
        navigate('/admin/laundryReception');
        toast.success('Address added successfully for customer');
      } else {
        navigate(-1);
        toast.success('Address added successfully');
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'An error occurred while adding the address.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return {
    country, setCountry,
    state, setState,
    city, setCity,
    area, setArea,
    street, setStreet,
    floorDoorNumber, setFloorDoorNumber,
    address, setAddress,
    location, setLocation,
    pinCode, setPinCode,
    landmark, setLandmark,
    selectedValue, setSelectedValue,
    phoneNumber, setPhoneNumber,
    postOffices, isLoading, selectedPostOffice,
    handlePostOfficeChange,
    handleMapLocationClick,
    handleCancel,
    handleSubmit
  };
}; 