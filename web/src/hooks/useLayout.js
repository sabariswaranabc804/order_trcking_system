import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext';
import { useTheme as useMuiTheme, useMediaQuery } from '@mui/material';
import Swal from 'sweetalert2';
import { logout } from '../features/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
const apiUrl = import.meta.env.VITE_API_URL;


const useLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const dispatch=useDispatch();
  
  const { dispatch: cartDispatch } = useCart();
  const { dispatch: wishlistDispatch } = useWishlist();
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
 const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of your account!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    });

    if (result.isConfirmed) {
      try {
        await fetch(`${apiUrl}/auth/logout`, {
          method: 'POST',
          credentials: 'include'
        });
        Swal.fire('Logged Out!', 'You have been successfully logged out.', 'success');
        cartDispatch({ type: 'RESET_CART' }); 
        wishlistDispatch({ type: 'RESET_WISHLIST' });
        localStorage.removeItem('totalPrice');
        localStorage.removeItem('totalQuantity');
 
        navigate('/');
      } catch (err) {
        /* console.error('Logout error:', err); */
        Swal.fire('Error!', 'Failed to logout. Please try again.', 'error');
      }
    }
  };

  return {
    mobileOpen,
    setMobileOpen,     // Make sure this is included
    isDarkMode,
    toggleTheme,
    isMobile,
    handleDrawerToggle,
    handleLogout,
  
  };
};

export default useLayout;