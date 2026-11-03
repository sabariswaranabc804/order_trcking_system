import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/userSlice';
import { fetchUserProfile } from '../../service/admin/profileService';

export const useProfile = (userID) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch user profile data
  useEffect(() => {
    const getUserProfile = async () => {
      try {
        if (userID) {
          const data = await fetchUserProfile(userID);
          setUser(data);
        } else {
          navigate('/login');
        }
      } catch (error) {
        navigate('/login');
      }
    };

    getUserProfile();
  }, [userID, navigate]);

  // Function to handle card clicks
  const handleCardClick = (path) => {
    navigate(path);
  };

  // Function to handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return {
    user,
    handleCardClick,
    handleLogout
  };
};