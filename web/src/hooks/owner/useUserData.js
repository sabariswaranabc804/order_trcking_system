import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';

export const useUserData = () => {
  const [userData, setUserData] = useState(null);
 // const userID = useSelector((state) => state.user.userID);
   const{user}=useAuth();
   const userID =user?.user_code;
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (userID) {
          const response = await fetch(`${API_URL}/api/users/${userID}`);
          if (!response.ok) throw new Error('User not found');
          const data = await response.json();
          /* console.log("dataaaaaaa", data); */
          
          setUserData(data);
        }
      } catch (error) {
        /* console.error('Failed to fetch user data:', error); */
      }
    };

    fetchUserData();
  }, [userID]);

  return userData;
};