import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { useWishlist } from '../../../context/WishlistContext';
import ServiceCard from '../Home/ServiceCard'; // Assuming ServiceCard is in the same folder
import { Container, Typography, Box, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import axios from 'axios';
import API_URL from '../../../config';
import UserNavbar from '../Home/UserNavbar';
import { useAuth } from '../../../context/AuthContext';

function Wishlist() {
  const { wishlist } = useWishlist();
  const { user } = useAuth();
  const customerId = user?.user_code;
  const theme = useTheme();
  const [refresh, setRefresh] = useState(false); // Add refresh state
  const [favlist, setFavlist] = useState([]);
  const triggerRefresh = () => {
    setRefresh(!refresh); // Toggle the refresh state to trigger re-render
  };
  useEffect(() => {
    const fetchProductsAndWishlist = async () => {
      try {

        const wishlistResponse = await axios.get(`${API_URL}/api/wishlist/${customerId}`);
        const wishlistProductIds = wishlistResponse.data;

        setFavlist(wishlistProductIds);
      } catch (error) {
        // console.error('Error fetching data:', error);
      }
    };

    fetchProductsAndWishlist();
  }, [refresh]);



  return (
    <>
      <UserNavbar />
      <Container>
        <Box sx={{
          padding: '20px',
          boxSizing: 'border-box',
          minHeight: '100vh',
          bgcolor: theme.palette.background.default
        }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontFamily: 'Outfit, serif',
              mt: 2,
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            Your Favorites
          </Typography>
          {favlist.length === 0 ? (
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Outfit, serif',
                mt: 2,
                color: theme.palette.text.secondary
              }}
            >
              Your wishlist is empty.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {favlist.map((service) => (
                <Grid
                  item
                  xs={6}  // 2 cards per row on extra-small screens (360px and up)
                  sm={6}  // 2 cards per row on small screens (600px and up)
                  md={3}  // 4 cards per row on medium screens (960px and up)
                  lg={3}
                  key={service.servSubType_Id}
                >
                  <ServiceCard triggerRefresh={triggerRefresh} refresh={refresh} service={service} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
    </>
  );
}

export default Wishlist;
