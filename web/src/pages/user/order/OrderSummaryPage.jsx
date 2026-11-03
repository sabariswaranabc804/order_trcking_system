import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardActions, Typography, Grid, Button, Tooltip, useMediaQuery, Box, useTheme, Paper, Chip, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import API_URL from '../../../config';
import UserNavbar from '../Home/UserNavbar';
import { useAuth } from '../../../context/AuthContext';

function OrderSummaryPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();
  const userId = user?.user_code;
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/orders/user/${userId}`);
        setOrders(response.data.data);
      } catch (error) {
        // console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [userId]);

  const handleCardClick = (order) => {
    navigate('/product-details', { state: { orderId: order.order_id } });
  };

  const getPaymentStatusInfo = (payment) => {
    switch (payment) {
      case 'offline':
        return { label: 'Cash On Delivery', color: 'warning' };
      case 'online':
        return { label: 'Verifying', color: 'info' };
      case 'paid':
        return { label: 'Paid', color: 'success' };
      default:
        return { label: 'COD', color: 'default' };
    }
  };

  return (
    <>
      <UserNavbar />
      <Box sx={{
        bgcolor: theme.palette.background.default,
        minHeight: '100vh',
        py: 4
      }}>
        <Box sx={{ maxWidth: 1400, margin: 'auto', px: 3 }}>
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
              <ReceiptLongIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />
              My Orders
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, ml: 5 }}>
              {orders.length > 0 ? `${orders.length} order${orders.length > 1 ? 's' : ''} found` : 'No orders yet'}
            </Typography>
          </Box>

          {/* Orders Grid */}
          {orders.length === 0 ? (
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
              <ShoppingBagIcon
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
                No orders yet
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 3,
                  color: theme.palette.text.secondary
                }}
              >
                Start shopping to see your orders here
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/user')}
              >
                Start Shopping
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {orders.map((order) => {
                const paymentInfo = getPaymentStatusInfo(order.payment);
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={order.order_id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: theme.palette.mode === 'dark'
                            ? '0 8px 24px rgba(0,0,0,0.4)'
                            : '0 8px 24px rgba(0,0,0,0.12)',
                          borderColor: theme.palette.primary.main,
                        }
                      }}
                      onClick={() => handleCardClick(order)}
                    >
                      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                        {/* Order ID */}
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mb: 2
                        }}>
                          <Typography
                            variant="caption"
                            sx={{
                              color: theme.palette.text.secondary,
                              textTransform: 'uppercase',
                              letterSpacing: 0.5
                            }}
                          >
                            Order ID
                          </Typography>
                          <Chip
                            label={`#${order.order_id}`}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              bgcolor: theme.palette.mode === 'dark'
                                ? 'rgba(122, 215, 204, 0.15)'
                                : 'rgba(65, 179, 163, 0.1)',
                              color: theme.palette.primary.main
                            }}
                          />
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        {/* Payment Status */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                          <PaymentIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                            Payment:
                          </Typography>
                          <Chip
                            label={paymentInfo.label}
                            size="small"
                            color={paymentInfo.color}
                            sx={{
                              height: 20,
                              fontSize: '0.7rem',
                              fontWeight: 600
                            }}
                          />
                        </Box>

                        {/* Total Price */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                          <Typography
                            variant="body2"
                            sx={{ color: theme.palette.text.secondary }}
                          >
                            Total:
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              color: theme.palette.primary.main
                            }}
                          >
                            ₹{order.total_price}
                          </Typography>
                        </Box>

                        {/* Order Date */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarTodayIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                          <Typography
                            variant="caption"
                            sx={{ color: theme.palette.text.secondary }}
                          >
                            {new Date(order.order_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </Typography>
                        </Box>
                      </CardContent>

                      <CardActions sx={{ p: 2, pt: 0 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          startIcon={<LocalShippingIcon />}
                          onClick={() => handleCardClick(order)}
                          sx={{ py: 1 }}
                        >
                          Track Order
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      </Box>
    </>
  );
}

export default OrderSummaryPage;
