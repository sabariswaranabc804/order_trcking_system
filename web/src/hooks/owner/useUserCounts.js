import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config';

export const useUserCounts = () => {
  const [userCounts, setUserCounts] = useState([]);

  useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/counts`);
        setUserCounts(response.data.data);
      } catch (error) {
        /* console.error('Error fetching user counts:', error); */
      }
    };

    fetchUserCounts();
  }, []);

  return userCounts;
};