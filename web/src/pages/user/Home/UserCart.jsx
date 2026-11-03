import React from 'react';
import {
  Container, Typography, Button, Grid, IconButton, useMediaQuery, Box, useTheme, Paper, Card, CardContent, Divider, Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import { useAuth } from '../../../context/AuthContext';
import { useCartHelpers } from '../../../hooks/user/useCartHelpers';
import { useUserHomeData } from '../../../hooks/user/useUserHomeData';
import UserNavbar from './UserNavbar';
import API_URL from '../../../config';
import OpenAIVoiceCommandButton from '../../../components/user/OpenAIVoiceCommandButton';
import VoiceCommandButton from '../../../components/user/VoiceCommandButton';

function UserCart() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const theme = useTheme();

  const {
    cartItems,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleRemoveFromCart,
    calculateTotalPrice,
    calculateTotalQuantity
  } = useCartHelpers();

  // Get services data for voice commands
  const { services } = useUserHomeData();

  // Handle voice command service filtering (navigate to home with filter)
  const handleVoiceServiceFilter = (serviceName) => {
    // Navigate to home page with the service filter
    navigate(`/?filter=${encodeURIComponent(serviceName)}`);
  };

  const queryParams = new URLSearchParams(location.search);
  const category = Number(queryParams.get('category'));

  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const handlePlaceOrder = () => {
    if (user?.user_code) {
      localStorage.setItem('totalPrice', calculateTotalPrice().toFixed(2));
      localStorage.setItem('totalQuantity', calculateTotalQuantity().toFixed(2));
      navigate('/delivery');
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Please log in',
        text: 'You need to log in to place an order.',
        showCancelButton: true,
        confirmButtonText: 'Log In',
        cancelButtonText: 'Cancel'
      }).then(result => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
    }
  };
  /* console.log("carditems", cartItems); */

  return (
    <>
      <UserNavbar />
      <Box sx={{
        bgcolor: theme.palette.background.default,
        minHeight: '100vh',
        py: 4
      }}>
        <Container maxWidth="lg">
          {/* Header Section */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 1
              }}
            >
              <ShoppingCartIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />
              Shopping Cart
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, ml: 5 }}>
              {cartItems.length > 0 ? `${cartItems.length} item${cartItems.length > 1 ? 's' : ''} in your cart` : 'Your cart is empty'}
            </Typography>
          </Box>

          {cartItems.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 8,
                textAlign: 'center',
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2
              }}
            >
              <ShoppingCartOutlinedIcon
                sx={{
                  fontSize: 80,
                  color: theme.palette.text.disabled,
                  mb: 2
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  mb: 1,
                  color: theme.palette.text.primary,
                  fontWeight: 500
                }}
              >
                Your cart is empty
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 3,
                  color: theme.palette.text.secondary
                }}
              >
                Add items to get started
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/user')}
              >
                Continue Shopping
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {/* Cart Items Section */}
              <Grid item xs={12} md={8}>
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    overflow: 'hidden'
                  }}
                >
                  {cartItems.map((item, index) => (
                    <Box key={index}>
                      <Box sx={{ p: 2 }}>
                        <Grid container spacing={2} alignItems="center">
                          {/* Product Image */}
                          <Grid item xs={3} sm={2}>
                            <Box
                              component="img"
                              src={`${API_URL}/uploads/product-images/${item.imagefile}`}
                              alt={item.servSubType_Name}
                              sx={{
                                width: '100%',
                                height: { xs: 60, sm: 80 },
                                objectFit: 'cover',
                                borderRadius: 1,
                                bgcolor: theme.palette.action.hover
                              }}
                            />
                          </Grid>

                          {/* Product Details */}
                          <Grid item xs={9} sm={5}>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 600,
                                textTransform: 'capitalize',
                                color: theme.palette.text.primary,
                                mb: 0.5
                              }}
                            >
                              {item.servSubType_Name}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                textTransform: 'capitalize',
                                color: theme.palette.text.secondary,
                                mb: 0.5
                              }}
                            >
                              {item.serv_Name}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                color: theme.palette.primary.main
                              }}
                            >
                              ₹{parseFloat(item.rate).toFixed(2)}
                            </Typography>
                          </Grid>

                          {/* Quantity Controls */}
                          <Grid item xs={8} sm={3}>
                            <Box sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 1
                            }}>
                              <IconButton
                                size="small"
                                onClick={() => handleDecreaseQuantity(item.servSubType_Id)}
                                sx={{
                                  bgcolor: theme.palette.action.hover,
                                  '&:hover': {
                                    bgcolor: theme.palette.action.selected
                                  }
                                }}
                              >
                                <RemoveIcon fontSize="small" />
                              </IconButton>
                              <Typography
                                variant="body1"
                                sx={{
                                  fontWeight: 600,
                                  minWidth: 30,
                                  textAlign: 'center',
                                  color: theme.palette.text.primary
                                }}
                              >
                                {item.quantity}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() => handleIncreaseQuantity(item.servSubType_Id)}
                                sx={{
                                  bgcolor: theme.palette.primary.main,
                                  color: theme.palette.primary.contrastText,
                                  '&:hover': {
                                    bgcolor: theme.palette.primary.dark
                                  }
                                }}
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Grid>

                          {/* Delete Button */}
                          <Grid item xs={4} sm={2} sx={{ textAlign: 'right' }}>
                            <IconButton
                              onClick={() => handleRemoveFromCart(item.servSubType_Id)}
                              sx={{
                                color: theme.palette.error.main,
                                '&:hover': {
                                  bgcolor: theme.palette.mode === 'dark'
                                    ? 'rgba(244, 67, 54, 0.15)'
                                    : 'rgba(244, 67, 54, 0.08)'
                                }
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Box>
                      {index < cartItems.length - 1 && (
                        <Divider sx={{ borderColor: theme.palette.divider }} />
                      )}
                    </Box>
                  ))}
                </Paper>
              </Grid>

              {/* Order Summary Section */}
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    position: 'sticky',
                    top: 80
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 3,
                      fontWeight: 600,
                      color: theme.palette.text.primary
                    }}
                  >
                    Order Summary
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        Subtotal ({cartItems.length} items)
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                        ₹{calculateTotalPrice().toFixed(2)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        Total Quantity
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                        {calculateTotalQuantity()}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                      Total
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                      ₹{calculateTotalPrice().toFixed(2)}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    onClick={handlePlaceOrder}
                    sx={{ py: 1.5 }}
                  >
                    Proceed to Checkout
                  </Button>

                  <Button
                    variant="text"
                    color="primary"
                    fullWidth
                    onClick={() => navigate('/user')}
                    sx={{ mt: 1 }}
                  >
                    Continue Shopping
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>

      {/* Voice Commands - Only show if services are loaded */}
      {services && services.length > 0 && (
        import.meta.env.VITE_OPENAI_API_KEY ? (
          <OpenAIVoiceCommandButton services={services} onServiceFilter={handleVoiceServiceFilter} />
        ) : (
          <VoiceCommandButton services={services} onServiceFilter={handleVoiceServiceFilter} />
        )
      )}
    </>
  );
}

export default UserCart;
