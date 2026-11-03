import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';

export const useDeliverymen = () => {
  const [deliverymen, setDeliverymen] = useState([]);
  const {user}=useAuth();
  const companyId = user?.company_Id;
 
  
  useEffect(() => {
    const fetchDeliverymen = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/counts`);
        setDeliverymen(response.data);
      } catch (error) {
        /* console.error('Error fetching deliverymen:', error); */
      }
    };

    fetchDeliverymen();
  }, []);

  return deliverymen;
};