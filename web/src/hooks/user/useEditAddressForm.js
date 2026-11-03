import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { updateAddress } from '../../service/user/addressService';
import { useAuth } from '../../context/AuthContext';

export const useEditAddressForm = () => {
  const locationupdate = useLocation();
  const addressupdate = locationupdate.state?.address;
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.user_code;

  const [country, setCountry] = useState('India');
  const [state, setState] = useState('Tamil-Nadu');
  const [city, setCity] = useState(addressupdate.city_Id);
  const [area, setArea] = useState(addressupdate.Area);
  const [street, setStreet] = useState(addressupdate.Street);
  const [floorDoorNumber, setFloorDoorNumber] = useState(addressupdate.Floor_Door_no);
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState({ latitude: '', longitude: '' });
  const [phoneNumber, setPhoneNumber] = useState(addressupdate.mobile_number);
  const [pinCode, setPinCode] = useState(addressupdate.pin_Code);
  const [landmark, setLandmark] = useState(addressupdate.Landmark);
  const [addressId, setAddressId] = useState(addressupdate.AddressId);
  const [selectedValue, setSelectedValue] = useState('');

  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
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
        // Optionally handle error
      });
    } else {
      alert('Geolocation is not supported by this browser.');
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
      address,
      addressId
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
      await updateAddress(addressData);
      navigate(-1);
      toast.success('Address updated successfully');
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'An error occurred while updating the address.',
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
    addressId, setAddressId,
    handleRadioChange,
    handleMapLocationClick,
    handleCancel,
    handleSubmit
  };
};
