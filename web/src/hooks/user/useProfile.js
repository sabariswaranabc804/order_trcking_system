import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/userSlice';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import apiUrl from '../../config';
import { useTheme as useMuiTheme } from '@mui/material/styles';

export const useProfile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useMuiTheme();
  const { user: users, loading } = useAuth();
  const userID = users?.user_code;
  const { dispatch: cartDispatch } = useCart();
  const { dispatch: wishlistDispatch } = useWishlist();
 // console.log("usersssss",users,userID);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (userID) {
          const response = await fetch(`${API_URL}/api/users/${userID}`);
          if (!response.ok) throw new Error('User not found');
          const data = await response.json();
          setUser(data);
        } else {
          navigate('/login');
        }
      } catch (error) {
        navigate('/login');
      }
    };

    fetchUserProfile();
  }, [userID, navigate]);

  const handleCardClick = (path) => {
    navigate(path);
  };

  // const handleLogout = () => {
  //   dispatch(logout());
  //   cartDispatch({ type: 'RESET_CART' });  
  //   wishlistDispatch({ type: 'RESET_WISHLIST' });
  //   localStorage.removeItem('totalPrice');
  //   localStorage.removeItem('totalQuantity');
  //   navigate('/user');
  // };
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of your account!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: theme.palette.primary.main,
      cancelButtonColor: theme.palette.error.main,
      confirmButtonText: 'Yes, logout!',
      background: theme.palette.background.paper,
      color: theme.palette.text.primary,
      customClass: {
        popup: 'swal-themed-popup',
        confirmButton: 'swal-themed-confirm',
        cancelButton: 'swal-themed-cancel'
      }
    });

    if (result.isConfirmed) {
      try {
        await fetch(`${apiUrl}/api/auth/logout`, {
          method: 'POST',
          credentials: 'include'
        });
        Swal.fire({
          title: 'Logged Out!',
          text: 'You have been successfully logged out.',
          icon: 'success',
          confirmButtonColor: theme.palette.primary.main,
          background: theme.palette.background.paper,
          color: theme.palette.text.primary
        });
        cartDispatch({ type: 'RESET_CART' }); 
        wishlistDispatch({ type: 'RESET_WISHLIST' });
        localStorage.removeItem('totalPrice');
        localStorage.removeItem('totalQuantity');
 
        navigate('/');
      } catch (err) {
        /* console.error('Logout error:', err); */
        Swal.fire({
          title: 'Error!',
          text: 'Failed to logout. Please try again.',
          icon: 'error',
          confirmButtonColor: theme.palette.primary.main,
          background: theme.palette.background.paper,
          color: theme.palette.text.primary
        });
      }
    }
  };
  return {
    user,
    handleCardClick,
    handleLogout
  };
};