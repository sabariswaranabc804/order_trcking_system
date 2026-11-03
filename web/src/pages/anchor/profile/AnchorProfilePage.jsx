import React, { useEffect, useState } from 'react';
import { Avatar, Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PaymentIcon from '@mui/icons-material/Payment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useDispatch, useSelector } from 'react-redux';  // Import useDispatch and useSelector
import { logout } from '../../../features/userSlice';  // Import the logout action
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import API_URL from '../../../config';
import { useAuth } from '../../../context/AuthContext';
function AnchorProfilePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();  // Initialize dispatch
  const { user: userDetails } = useAuth();
  const userID = userDetails?.user_code; // Get userID from Redux store

  // Fetch user profile data
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
        // console.error('Failed to fetch user data:', error);
        navigate('/login');
      }
    };

    fetchUserProfile();
  }, [userID, navigate]);

  // Function to handle card clicks
  const handleCardClick = (path) => {
    navigate(path);
  };

  // Function to handle logout
  const handleLogout = () => {
    dispatch(logout());  // Dispatch the logout action from Redux
    navigate('/');  // Redirect to the homepage or login page
  };

  if (!user) {
    return <Typography>Loading...</Typography>;  // Or a spinner/loading indicator
  }

  return (
    <Container>
      <Grid container spacing={3} alignItems="center" justifyContent="center" style={{ marginTop: 20 }}>
        <Grid item xs={12} sm={4}>
          <Avatar alt="" src="https://cdn.pixabay.com/photo/2024/01/13/17/36/delivery-8506321_1280.jpg" style={{ width: 100, height: 100, margin: '0 auto' }} />
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography variant="h5">{user.user_Name}</Typography>
          <Typography variant="body1">{user.alternativephoneNumber}</Typography>
          <Typography variant="body1">
            <PhoneIcon sx={{ mr: 1, color: "rgba(17, 125, 247, 0.8)" }} />Phone Number:<span style={{ fontWeight: "bold" }}>{user.mobile_Number}</span>
          </Typography>
          <Typography variant="body1">
            <EmailIcon sx={{ mr: 1, color: "rgba(17, 125, 247, 0.8)" }} />Email: <span style={{ fontWeight: "bold" }}>{user.email_ID}</span>
          </Typography>
        </Grid>
      </Grid>

      {/* <Typography variant="h6" style={{ marginTop: 40 }}>
        My Activity
      </Typography> */}


      {/* Logout Button */}
      {/* <Grid container justifyContent="center" style={{ marginTop: 40 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          startIcon={<ExitToAppIcon />}
          style={{ marginTop: 20  ,backgroundColor:"red"}}
        >
          Logout
        </Button>
      </Grid> */}
    </Container>
  );
}

export default AnchorProfilePage;
