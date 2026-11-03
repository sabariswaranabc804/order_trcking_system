import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Tabs,
  Tab,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  Chip,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Card, CardContent, Grid } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import MapIcon from '@mui/icons-material/Map';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import 'react-toastify/dist/ReactToastify.css';
import Paper from '@mui/material/Paper';
import useTakeOrder from '../../../hooks/anchor/useTakeOrder';
import { getStatusColor, openGoogleMaps, dialPhoneNumber } from '../../../utils/takeOrderUtils';

const formatDate = (value) => {
  if (!value) return '';
  try {
    const date = new Date(value);
    return date.toLocaleDateString();
  } catch {
    return value;
  }
};

const TakeOrderAnchor = () => {
  const theme = useTheme();
  const {
    filteredStatus,
    searchQuery,
    products,
    orderData,
    open,
    startDate,
    endDate,
    filteredOrders,
    orderCounts,
    handleStatusChange,
    handleSearch,
    handleOrderClick,
    handleClose,
    handleSendTaskToAnchor,
    handleStartDateChange,
    handleEndDateChange,
    refreshData,
  } = useTakeOrder();

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        bgcolor: theme.palette.background.default,
        minHeight: '100vh'
      }}
    >
      {/* Header */}
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: 600,
          color: theme.palette.text.primary
        }}
      >
        Assigned Orders
      </Typography>

      {/* Filter tabs */}
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Tabs
          value={filteredStatus}
          onChange={handleStatusChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              minHeight: 48,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              color: theme.palette.text.secondary,
              '&.Mui-selected': {
                color: theme.palette.primary.main,
                fontWeight: 600
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.primary.main
            }
          }}
        >
          <Tab label={`Assign By Admin (${orderCounts.assignByAdmin})`} value="Assign By Admin" />
          <Tab label={`Picked Orders (${orderCounts.confirmed})`} value="CONFIRMED" />
          <Tab label={`Dropped Orders (${orderCounts.readyForDelivery})`} value="READY_FOR_DELIVERY" />
        </Tabs>
      </Paper>

      {/* Search and Date Filters */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            gap: 2
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              flex: 1
            }}
          >
            <TextField
              label="Start date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={handleStartDateChange}
              size="small"
              sx={{ minWidth: { sm: 180 } }}
            />
            <TextField
              label="End date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={handleEndDateChange}
              size="small"
              sx={{ minWidth: { sm: 180 } }}
            />
          </Box>

          <TextField
            label="Search Name Or Order Id..."
            value={searchQuery}
            onChange={handleSearch}
            size="small"
            sx={{
              minWidth: { md: 300 },
              maxWidth: { md: 400 }
            }}
            InputProps={{
              endAdornment: (
                <IconButton size="small">
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
        </Box>
      </Paper>

      {/* Orders Cards */}
      <Grid container spacing={3}>
        {filteredOrders.length === 0 ? (
          <Grid item xs={12}>
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
                No orders found
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary
                }}
              >
                There are no orders matching your filters
              </Typography>
            </Paper>
          </Grid>
        ) : (
          filteredOrders.map((order) => (
            <Grid item xs={12} sm={6} md={4} key={order.order_id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 8px 24px rgba(0,0,0,0.4)'
                      : '0 8px 24px rgba(0,0,0,0.12)',
                    borderColor: theme.palette.primary.main,
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                  {/* Order ID and Status */}
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                  }}>
                    <Chip
                      label={`#${order.order_id}`}
                      size="small"
                      onClick={() => handleOrderClick(order.order_id)}
                      sx={{
                        fontWeight: 600,
                        bgcolor: theme.palette.mode === 'dark'
                          ? 'rgba(122, 215, 204, 0.15)'
                          : 'rgba(65, 179, 163, 0.1)',
                        color: theme.palette.primary.main,
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: theme.palette.mode === 'dark'
                            ? 'rgba(122, 215, 204, 0.25)'
                            : 'rgba(65, 179, 163, 0.2)',
                        }
                      }}
                    />
                    <Chip
                      label={order.StatusText}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        bgcolor: `${getStatusColor(order.StatusText)}20`,
                        color: getStatusColor(order.StatusText)
                      }}
                    />
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {/* Customer Info */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <PersonIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          textTransform: 'capitalize'
                        }}
                      >
                        {order.user_Name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                      <Typography
                        variant="caption"
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        {order.customer_phone}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Order Details */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                        Date:
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                        {formatDate(order.order_date)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                        Items:
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                        {order.total_item}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                        Location:
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          textTransform: 'capitalize'
                        }}
                      >
                        {order.city_Id}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {/* Total Price */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                      Total:
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.primary.main
                      }}
                    >
                      ₹{order.total_price}
                    </Typography>
                  </Box>

                  {/* Accept Button */}
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    onClick={async () => {
                      await handleSendTaskToAnchor(order.order_id);
                    }}
                    sx={{ py: 1.5 }}
                  >
                    Accept Order
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>


      {/* Dialog Box for Order Details */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: theme.palette.background.paper,
            borderRadius: 2
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: theme.palette.mode === 'dark' 
            ? 'rgba(122, 215, 204, 0.08)' 
            : 'rgba(65, 179, 163, 0.05)',
          color: theme.palette.text.primary,
          fontWeight: 600
        }}>
          Order Details
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {orderData && products ? (
            <Grid container spacing={3}>
              {/* Products Table */}
              <Grid item xs={12}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    overflow: 'hidden'
                  }}
                >
                  <Box sx={{ p: 2, bgcolor: theme.palette.action.hover }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                      Products
                    </Typography>
                  </Box>
                  <TableContainer sx={{ maxHeight: 300 }}>
                    <Table stickyHeader size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ bgcolor: theme.palette.background.paper, fontWeight: 600 }}>Product</TableCell>
                          <TableCell sx={{ bgcolor: theme.palette.background.paper, fontWeight: 600 }}>Category</TableCell>
                          <TableCell align="right" sx={{ bgcolor: theme.palette.background.paper, fontWeight: 600 }}>Rate</TableCell>
                          <TableCell align="center" sx={{ bgcolor: theme.palette.background.paper, fontWeight: 600 }}>Qty</TableCell>
                          <TableCell align="right" sx={{ bgcolor: theme.palette.background.paper, fontWeight: 600 }}>Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {products.map((product, index) => (
                          <TableRow key={index} hover>
                            <TableCell>{product.product_name}</TableCell>
                            <TableCell>{product.category_name}</TableCell>
                            <TableCell align="right">₹{product.rate}</TableCell>
                            <TableCell align="center">{product.quantity}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>₹{product.total_price}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={4} align="right" sx={{ fontWeight: 600, bgcolor: theme.palette.action.hover }}>
                            Total:
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700, bgcolor: theme.palette.action.hover, color: theme.palette.primary.main }}>
                            ₹{orderData.total_price}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>

              {/* Address Details */}
              <Grid item xs={12} sm={6}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2.5,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    height: '100%'
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: theme.palette.text.primary }}>
                    Delivery Address
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5, color: theme.palette.text.primary, textTransform: 'capitalize' }}>
                    {orderData.Street}, {orderData.Floor_Door_no}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, color: theme.palette.text.secondary, textTransform: 'capitalize' }}>
                    {orderData.Area}, {orderData.city_Id}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <PhoneIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      {orderData.mobile_number}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      startIcon={<PhoneIcon />}
                      onClick={() => dialPhoneNumber(orderData.mobile_number)}
                    >
                      Call Customer
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      startIcon={<MapIcon />}
                      onClick={() => openGoogleMaps(orderData.longitude, orderData.lattitude, orderData.address[0])}
                    >
                      Open in Maps
                    </Button>
                  </Box>
                </Paper>
              </Grid>

              {/* Order Summary */}
              <Grid item xs={12} sm={6}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2.5,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    height: '100%'
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: theme.palette.text.primary }}>
                    Order Summary
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        Order ID:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                        #{orderData.order_id}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        Order Date:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                        {new Date(orderData.order_date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                        Total:
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                        ₹{orderData.total_price}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography sx={{ color: theme.palette.text.secondary }}>Loading...</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: theme.palette.action.hover }}>
          <Button onClick={handleClose} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TakeOrderAnchor;