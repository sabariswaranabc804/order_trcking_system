import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Button,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import {  useTheme } from '@mui/material/styles';
import logo from '../../../assets/img/Kirush4.png';
import { useCart } from '../../../context/CartContext';
import useCompanySettings from '../../../hooks/owner/useCompanySettings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import API_URL from '../../../config';
import { useAuth } from '../../../context/AuthContext';
function UserNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartItems } = useCart();
  const userID = useSelector((state) => state.user.userID);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme(); // Use the theme from ThemeProvider context
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { companyData } = useCompanySettings();
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileClick = () => {
    navigate('/account');  // Navigate to /account page when My Profile is clicked
  };


  return (
   
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" sx={{ backgroundColor: 'primary', zIndex: 1300 }}>
          <Toolbar>
            <Button color="inherit" component={Link} to="/user" sx={{ marginRight: 2 }}>
              <img src={`${API_URL}/uploads/company/logo/${companyData.logo}`} alt="Logo" style={{ height: 60, marginRight: 20, borderRadius: "50%" }} />

              <Typography
                sx={{
                  fontFamily: 'Outfit, serif',
                  fontOpticalSizing: 'auto',
                  fontWeight: 500,
                  color:' #FFFFFF',
                  fontStyle: 'normal',
                  fontSize: { xs: '14px', sm: '14px', md: '16px' }
                }}
              >
                {companyData.name}
              </Typography>

            </Button>

            <Box sx={{ flexGrow: 1 }} />

            <Link to="/cart-category" style={{ color: 'inherit', textDecoration: 'none' }}>
              <IconButton color="inherit">
                <Badge badgeContent={cartItems.length} color="warning">
                  <LocalLaundryServiceIcon sx={{color:' #FFFFFF',}} />
                </Badge>
                {!isMobile && (
                  <Typography variant="body1" component="span" sx={{ marginLeft: 1 , color:' #FFFFFF',}}>
                    Bucket
                  </Typography>
                )}
              </IconButton>
            </Link>
            {/* <Link to="/UserNotifications" style={{color:'inherit'}}>
                <IconButton color='inherit'>
                  <NotificationsIcon/>
                </IconButton>
            </Link> */}
            {user?.user_code ? (
              <>

                <IconButton color="inherit" onClick={handleProfileClick}>
                  <AccountCircle sx={{color:' #FFFFFF',}} />
                  {!isMobile && (
                    <Typography variant="body1" component="span" sx={{ marginLeft: 1,color:' #FFFFFF' }}>
                      My Profile
                    </Typography>
                  )}
                </IconButton>
              </>
            ) : (
              <Link to="/login" style={{ color: 'inherit', textDecoration: 'none' }}>
                <IconButton color="inherit">
                  <AccountCircle sx={{color:' #FFFFFF',}} />
                  {!isMobile && (
                    <Typography variant="body1" component="span" sx={{ marginLeft: 1, color:' #FFFFFF', }}>
                      Login
                    </Typography>
                  )}
                </IconButton>
              </Link>
            )}
          </Toolbar>
        </AppBar>
      </Box>

  );
}

export default UserNavbar;