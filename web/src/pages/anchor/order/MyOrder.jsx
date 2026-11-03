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
import { Cancel, Visibility, CheckCircle, Warning, History, Person, CalendarToday, Payment, LocationOn, ShoppingBag } from '@mui/icons-material';
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
import useOrderList from '../../../hooks/anchor/useHistoryOrder';
import useOrderDetails from '../../../hooks/anchor/pickuporder/useOrderDetails';
import usePaymentEdit from '../../../hooks/anchor/pickuporder/usePaymentEdit';

// Import utilities
import { openGoogleMaps, dialPhoneNumber, formatPaymentStatus } from '../../../utils/pickupOrderUtils';
import { getStatusColor } from '../../../utils/pickupOrderUtils';
// import { updateOrderStatus } from '../../../service/admin/orderService2';
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
  } = usePaymentEdit();




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
          background: `linear-gradient(135deg, ${theme.palette.success.main}15 0%, ${theme.palette.info.main}15 100%)`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <History sx={{ fontSize: 32, color: 'success.main' }} />
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Order History
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          View all completed and past orders
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
                <Chip label={orderCounts?.all || 0} size="small" color="primary" />
              </Box>
            }
            value="All"
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>Picked</span>
                <Chip label={orderCounts?.picked || 0} size="small" color="info" />
              </Box>
            }
            value="3"
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>Dropped</span>
                <Chip label={orderCounts?.dropped || 0} size="small" color="success" />
              </Box>
            }
            value="7"
          />
        </Tabs>
      </Paper>

      {/* Search and Date Filters */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={4}>
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
        </Grid>
      </Paper>

      {/* Orders Card Grid */}
      <Grid container spacing={2}>
        {filteredOrders.map((order) => (
          <Grid item xs={12} key={order.history_id}>
            <Card
              elevation={0}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: theme.shadows[4],
                  transform: 'translateY(-2px)',
                  borderColor: theme.palette.success.main
                }
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Grid container spacing={2} alignItems="center">
                  {/* Order ID & Customer Info */}
                  <Grid item xs={12} sm={6} md={3}>
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
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'success.main', fontSize: '0.875rem' }}>
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
                  <Grid item xs={6} sm={3} md={2}>
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
                      <Box>
                        {formatPaymentStatus(order.payment)}
                      </Box>
                    </Box>
                  </Grid>

                  {/* Price */}
                  <Grid item xs={6} sm={3} md={2}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Total Amount
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                        ₹{order.total_price}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Status */}
                  <Grid item xs={6} sm={3} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircle sx={{ fontSize: 20, color: getStatusColor(order.StatusText) }} />
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
                    </Box>
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
          <History sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Order History Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your filters or date range
          </Typography>
        </Paper>
      )}

      {/* Payment Edit Dialog */}
      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Order ID: {selectedOrderId}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Select Payment Status:</Typography>
          <Select
            placeholder='gf'
            value={selectedPayment}
            onChange={handlePaymentChange}
            fullWidth
          >
            <MenuItem value="offline">COD</MenuItem>
            <MenuItem value="online">Verify</MenuItem>
            <MenuItem value="paid">PAID</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="primary">Cancel</Button>
          <Button onClick={handleSubmit} color="primary">Submit</Button>
        </DialogActions>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2
          }
        }}
      >
        <DialogTitle sx={{
          bgcolor: 'success.main',
          color: 'success.contrastText',
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
                      <ShoppingBag color="primary" />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Order Information
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Order ID:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>#{orderData.order_id}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Order Date:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {new Date(orderData.order_date).toLocaleDateString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>Total Amount:</Typography>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                            ₹{orderData.total_price}
                          </Typography>
                        </Box>
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
                              <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
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
                      <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                        ₹{orderData.total_price}
                      </Typography>
                    </Box>
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
          <Button onClick={handleClose} variant="contained" color="success">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TakeOrderAnchor;