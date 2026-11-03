import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config';

export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/customer`);
        setCustomers(response.data.data);
      } catch (error) {
        /* console.error('Error fetching customers:', error); */
      }
    };

    fetchCustomers();
  }, []);

  return customers;
};