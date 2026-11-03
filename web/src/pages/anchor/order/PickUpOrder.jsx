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
  Tooltip,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
  Paper,
  Stack,
  Chip,
  Divider,
  Avatar,
  useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Cancel, Visibility, CheckCircle, Warning, LocalShipping, Person, CalendarToday, Payment, LocationOn, ShoppingBag } from '@mui/icons-material';
import PhoneIcon from '@mui/icons-material/Phone';
import MapIcon from '@mui/icons-material/Map';
import EditIcon from '@mui/icons-material/Edit';
import QRCode from 'react-qr-code';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  DataGrid,
  GridActionsCellItem,
} from '@mui/x-data-grid';
// Import custom hooks
import useOrderList from '../../../hooks/anchor/pickuporder/useOrderList';
import useOrderDetails from '../../../hooks/anchor/pickuporder/useOrderDetails';
import usePaymentEdit from '../../../hooks/anchor/pickuporder/usePaymentEdit';

// Import utilities
import { dialPhoneNumber, formatPaymentStatus } from '../../../utils/pickupOrderUtils';
import { getStatusColor } from '../../../utils/pickupOrderUtils';
import { updateOrderStatus } from '../../../service/admin/orderService2';
import { useAuth } from '../../../context/AuthContext';


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
  const { user: userDetails } = useAuth();

  /* console.log("userDetails:", userDetails); */

  const {
    filteredStatus,
    searchQuery,
    startDate,
    endDate,
    filteredOrders,
    orderCounts,
    deliverymanId,
    refreshData,
    handleStatusChange,
    handleSearch,
    handleStartDateChange,
    handleEndDateChange
  } = useOrderList();

  const {
    orderData,
    products,
    open,
    gpayLink,
    gpayNumber,
    handleOrderClick,
    handleClose,
    handleRejectOrder
  } = useOrderDetails(deliverymanId);

  const {
    editOpen,
    selectedPayment,
    selectedOrderId,
    handleEditClick,
    handleEditClose,
    handlePaymentChange,
    handleSubmit
  } = usePaymentEdit(refreshData);

  const openGoogleMaps = (customerLng, customerLat, address) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const deliveryLat = position.coords.latitude;
          const deliveryLng = position.coords.longitude;

          // Construct Google Maps Direction URL
          const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${deliveryLat},${deliveryLng}&destination=${customerLat},${customerLng}&travelmode=driving`;

          // Open Google Maps
          window.open(googleMapsUrl, "_blank");
        },
        (error) => {
          /* console.error("Error getting current location:", error); */
          alert("Unable to fetch your current location. Please enable GPS.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <LocalShipping sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Pickup Orders
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Manage and track all pickup orders efficiently
        </Typography>
      </Paper>

      {/* Filter tabs */}
      <Paper elevation={0} sx={{ mb: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
        <Tabs
          value={filteredStatus}
          onChange={handleStatusChange}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.95rem'
            }
          }}
        >
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>All Orders</span>
                <Chip label={orderCounts.all} size="small" color="primary" />
              </Box>
            }
            value="All"
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>Pick</span>
                <Chip label={orderCounts.pick} size="small" color="warning" />
              </Box>
            }
            value="2"
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>Drop</span>
                <Chip label={orderCounts.drop} size="small" color="success" />
              </Box>
            }
            value="6"
          />
        </Tabs>
      </Paper>

      {/* Search and Date Filters */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={handleStartDateChange}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="End Date"
              type="date"
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={handleEndDateChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Search Name or Order ID"
              fullWidth
              size="small"
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                endAdornment: (
                  <IconButton size="small">
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              fullWidth
              onClick={refreshData}
              sx={{ height: 40 }}
            >
              Refresh
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Orders Card Grid */}
      <Grid container spacing={2}>
        {filteredOrders.map((order) => (
          <Grid item xs={12} key={order.order_id}>
            <Card
              elevation={0}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: theme.shadows[4],
                  transform: 'translateY(-2px)',
                  borderColor: theme.palette.primary.main
                }
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Grid container spacing={2} alignItems="center">
                  {/* Order ID & Customer Info */}
                  <Grid item xs={12} sm={6} md={2.5}>
                    <Box>
                      <Button
                        onClick={() => handleOrderClick(order.order_id, order.total_price)}
                        sx={{
                          p: 0,
                          minWidth: 'auto',
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: '1rem',
                          mb: 0.5
                        }}
                      >
                        #{order.order_id}
                      </Button>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
                          {order.user_Name?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {order.user_Name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {order.mobile_Number}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Date & City */}
                  <Grid item xs={6} sm={3} md={1.5}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(order.order_date)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {order.city_Id}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Payment Status */}
                  <Grid item xs={6} sm={3} md={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Payment sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {formatPaymentStatus(order.payment)}
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(order.order_id, order.payment)}
                          sx={{ ml: 0.5 }}
                        >
                          <EditIcon fontSize="small" color="primary" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Price */}
                  <Grid item xs={6} sm={3} md={1.5}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Total Amount
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        ₹{order.total_price}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Status */}
                  <Grid item xs={6} sm={3} md={1.5}>
                    <Chip
                      label={order.StatusText}
                      size="small"
                      sx={{
                        bgcolor: `${getStatusColor(order.StatusText)}20`,
                        color: getStatusColor(order.StatusText),
                        fontWeight: 600,
                        borderRadius: 1
                      }}
                    />
                  </Grid>

                  {/* Actions */}
                  <Grid item xs={12} md={3}>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={async () => {
                          try {
                            await updateOrderStatus({
                              orderId: order.order_id,
                              oldStatus: order.orderStatus_Id,
                              deliverymanId: userDetails?.deliveryman_id,
                              action: "accept"
                            });
                            await refreshData();
                          } catch (error) {
                            /* console.error('Error updating order status:', error); */
                          }
                        }}
                        sx={{ textTransform: 'none' }}
                      >
                        {order.StatusText === "PICKUP_ASSIGNED" ? "Picked Up" : "Set Delivered"}
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={async () => {
                          try {
                            await updateOrderStatus({
                              orderId: order.order_id,
                              oldStatus: order.orderStatus_Id,
                              deliverymanId: userDetails?.deliveryman_id,
                              action: "reject"
                            });
                            await refreshData();
                          } catch (error) {
                            /* console.error('Error updating order status:', error); */
                          }
                        }}
                        sx={{ textTransform: 'none' }}
                      >
                        Reject
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2
          }}
        >
          <ShoppingBag sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Orders Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your filters or search criteria
          </Typography>
        </Paper>
      )}

      {/* Payment Edit Dialog */}
      <Dialog
        open={editOpen}
        onClose={handleEditClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 400
          }
        }}
      >
        <DialogTitle sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Payment />
          Update Payment Status
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Order ID: <strong>#{selectedOrderId}</strong>
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
            Select Payment Status:
          </Typography>
          <Select
            value={selectedPayment}
            onChange={handlePaymentChange}
            fullWidth
            size="small"
            sx={{
              '& .MuiSelect-select': {
                py: 1.5
              }
            }}
          >
            <MenuItem value="offline">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip label="COD" size="small" color="warning" />
                <Typography variant="body2">Cash on Delivery</Typography>
              </Box>
            </MenuItem>
            <MenuItem value="online">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip label="Verify" size="small" color="info" />
                <Typography variant="body2">Verify Payment</Typography>
              </Box>
            </MenuItem>
            <MenuItem value="paid">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip label="PAID" size="small" color="success" />
                <Typography variant="body2">Payment Completed</Typography>
              </Box>
            </MenuItem>
          </Select>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleEditClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2
          }
        }}
      >
        <DialogTitle sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <ShoppingBag />
          Order Details
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {orderData && products ? (
            <Grid container spacing={3}>
              {/* Order Summary Card */}
              <Grid item xs={12} md={6}>
                <Card
                  elevation={0}
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    height: '100%'
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <ShoppingBag color="primary" />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Order Information
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Stack spacing={1.5}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Order ID:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>#{orderData.order_id}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Order Date:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {new Date(orderData.order_date).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">Total Amount:</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                          ₹{orderData.total_price}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Delivery Person Card */}
              <Grid item xs={12} md={6}>
                <Card
                  elevation={0}
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    height: '100%'
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Person color="primary" />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Delivery Person
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Stack spacing={1.5}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                          {orderData.deliveryman_name?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {orderData.deliveryman_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {orderData.contact}
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Address Details Card */}
              <Grid item xs={12}>
                <Card
                  elevation={0}
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    bgcolor: 'action.hover'
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <LocationOn color="primary" />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Delivery Address
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={8}>
                        <Stack spacing={1}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {orderData.Floor_Door_no}, {orderData.Street}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {orderData.Area}, {orderData.city_Id}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {orderData.mobile_number}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Stack spacing={1}>
                          <Button
                            variant="contained"
                            fullWidth
                            startIcon={<PhoneIcon />}
                            onClick={() => dialPhoneNumber(orderData.mobile_number)}
                            sx={{ textTransform: 'none' }}
                          >
                            Call Customer
                          </Button>
                          <Button
                            variant="contained"
                            fullWidth
                            color="warning"
                            startIcon={<MapIcon />}
                            onClick={() =>
                              openGoogleMaps(orderData.longitude, orderData.lattitude, orderData.address[0])
                            }
                            sx={{ textTransform: 'none' }}
                          >
                            Open Map
                          </Button>
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Products List */}
              <Grid item xs={12}>
                <Card
                  elevation={0}
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <ShoppingBag color="primary" />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Products ({products.length})
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Stack spacing={1.5}>
                      {products.map((product, index) => (
                        <Paper
                          key={index}
                          elevation={0}
                          sx={{
                            p: 2,
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 1,
                            bgcolor: 'background.default'
                          }}
                        >
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={5}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {product.product_name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {product.category_name}
                              </Typography>
                            </Grid>
                            <Grid item xs={4} sm={2}>
                              <Typography variant="caption" color="text.secondary">Rate</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                ₹{product.rate}
                              </Typography>
                            </Grid>
                            <Grid item xs={4} sm={2}>
                              <Typography variant="caption" color="text.secondary">Qty</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {product.quantity}
                              </Typography>
                            </Grid>
                            <Grid item xs={4} sm={3} sx={{ textAlign: 'right' }}>
                              <Typography variant="caption" color="text.secondary">Total</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                ₹{product.total_price}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Paper>
                      ))}
                    </Stack>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Grand Total
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        ₹{orderData.total_price}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Payment QR Code */}
              <Grid item xs={12}>
                <Card
                  elevation={0}
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    bgcolor: 'action.hover'
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Payment color="primary" />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Payment Information
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    <Grid container spacing={3} alignItems="center" justifyContent="center">
                      <Grid item xs={12} sm={6} sx={{ textAlign: 'center' }}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 3,
                            display: 'inline-block',
                            border: `2px solid ${theme.palette.primary.main}`,
                            borderRadius: 2
                          }}
                        >
                          <QRCode value={gpayLink} size={180} />
                        </Paper>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                          Scan to pay via GPay
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Stack spacing={2} alignItems="center">
                          <Typography variant="h6" color="text.secondary">
                            OR
                          </Typography>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              GPay Number
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
                              {gpayNumber}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography>Loading order details...</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleClose} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TakeOrderAnchor;