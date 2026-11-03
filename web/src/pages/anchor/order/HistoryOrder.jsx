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
  Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Cancel, Visibility, CheckCircle, Warning } from '@mui/icons-material';
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


//const theme = useTheme();
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
  // Use custom hooks

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

  /* console.log('HistoryOrder - orderCounts:', orderCounts); */
  /* console.log('HistoryOrder - filteredOrders length:', filteredOrders.length); */

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
  const columns = [
    {
      field: 'order_id',
      headerName: 'Order #Id',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Button onClick={() => handleOrderClick(params.row.order_id, params.row.total_price)}>
          #{params.row.order_id}
        </Button>
      ),
    },
    {
      field: 'user_Name',
      headerName: 'Customer',
      flex: 1,
      Width: 150,
      headerAlign: 'center',
      renderCell: (params) => (
        <Box sx={{ width: '100%' }}>
          <Typography sx={{ textAlign: 'center' }}>{params.row.user_Name}</Typography>
          <Typography variant="caption" sx={{ display: 'block', textAlign: 'center' }}>
            Ph - <b>{params.row.mobile_Number}</b>
          </Typography>
        </Box>
      )
    },
    {
      field: 'order_date',
      headerName: 'Date',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => formatDate(params.row.order_date),
    },
    {
      field: 'payment',
      headerName: 'PaymentStatus',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Box display="flex" alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
          {formatPaymentStatus(params.row.payment)}
          {/* <IconButton onClick={() => handleEditClick(params.row.order_id, params.row.payment)}>
          <EditIcon color="primary" fontSize="small" />
        </IconButton> */}
        </Box>
      ),
    },
    {
      field: 'city_Id',
      headerName: 'City',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'total_price',
      headerName: 'Price',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => `₹${params.row.total_price}`,
    },
    {
      field: 'StatusText',
      headerName: 'Current Status',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Typography
          style={{
            color: getStatusColor(params.row.StatusText),
            fontSize: '14px',

          }}
        >
          {params.row.StatusText}
        </Typography>
      ),
    },

  ];


  /* console.log("or", orderCounts); */


  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Order History</Typography>

      {/* Filter tabs */}
      <Tabs value={filteredStatus} onChange={handleStatusChange}>
        <Tab label={`All (${orderCounts?.all || 0})`} value="All" />
        <Tab label={`Picked (${orderCounts?.picked || 0})`} value="3" />
        <Tab label={`Dropped (${orderCounts?.dropped || 0})`} value="7" />
      </Tabs>

      {/* Search and Date Filters */}
      <Box my={2} display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" gap={2}>
          <TextField
            label="Start date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={handleStartDateChange}
          />
          <TextField
            label="End date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={handleEndDateChange}
          />
        </Box>

        <TextField
          label="Search Name or Order Id.."
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            endAdornment: (
              <IconButton>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
      </Box>

      {/* Orders Table */}
      <Box sx={{ height: 700, width: '100%', overflow: 'auto' }}>


        <DataGrid
          rows={filteredOrders}
          columns={columns}
          getRowId={(row) => row.history_id}

          pageSize={20}
          rowsPerPageOptions={[10, 20, 50]}
          pagination
          disableSelectionOnClick
          rowHeight={80}
          sx={{
            '& .MuiDataGrid-cell': {
              display: 'flex',
              alignItems: 'center',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5',
            },
          }}
        />
      </Box>

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
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {orderData && products ? (
            <Grid container spacing={2}>
              {/* Product List Card */}
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Products</Typography>
                    <TableContainer component={Paper} sx={{ maxHeight: 300, overflowX: 'auto' }}>
                      <Table stickyHeader aria-label="products-table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Product Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Rate</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Total Price</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {products.map((product, index) => (
                            <TableRow key={index}>
                              <TableCell>{product.product_name}</TableCell>
                              <TableCell>{product.category_name}</TableCell>
                              <TableCell>₹{product.rate}</TableCell>
                              <TableCell>{product.quantity}</TableCell>
                              <TableCell>₹{product.total_price}</TableCell>
                            </TableRow>
                          ))}
                          {/* Total Price Row */}
                          <TableRow>
                            <TableCell colSpan={4} align="right">
                              <Typography variant="subtitle1" component="div"><strong>Total Price:</strong></Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="subtitle1" component="div"><strong>₹{orderData.total_price}</strong></Typography>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* Address Details Card */}
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Address Details</Typography>
                    <Typography variant="body2">{orderData.city_Id},{orderData.Area}</Typography>
                    <Typography variant="body2">{orderData.Street},{orderData.Floor_Door_no}</Typography>
                    <Typography>Customer Phone Number: {orderData.mobile_number}</Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant="contained"
                        color="secondary"
                        sx={{ fontSize: "8" }}
                        startIcon={<PhoneIcon />}
                        onClick={() => dialPhoneNumber(orderData.mobile_number)}
                      >
                        Call Phone Number
                      </Button>

                      <Button
                        variant="contained"
                        sx={{ backgroundColor: 'rgba(255, 112, 3, 0.69)', color: "white", fontSize: "8" }}
                        startIcon={<MapIcon />}
                        onClick={() => openGoogleMaps(orderData.longitude, orderData.lattitude, orderData.address[0])}
                      >
                        Open Map
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Order Details Card */}
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6">Order Details</Typography>
                    <Typography variant="body1">Order ID: {orderData.order_id}</Typography>
                    <Typography variant="body1">Total Price: ₹{orderData.total_price}</Typography>
                    <Typography variant="body1">Order Date: {new Date(orderData.order_date).toLocaleDateString()}</Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Payment Card */}
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Payment</Typography>
                    <Typography variant="body1" style={{ marginBottom: '5px' }}>
                      Scan this QR code to pay:
                    </Typography>
                    <div style={{
                      marginTop: '10px',
                      marginBottom: '10px',
                      marginLeft: "10px",
                      textAlign: 'center',
                      display: 'flex',
                      justifyContent: "space-between",
                      alignItems: 'center',
                    }}>
                      <QRCode value={gpayLink} size={160} />
                      <Typography variant="h6" style={{ marginTop: '10px', marginLeft: "15px", padding: "0px" }}>
                        OR
                      </Typography>
                      <Typography variant="body1" style={{ marginTop: '10px' }}>
                        GPay Number: {gpayNumber}
                      </Typography>
                    </div>
                  </CardContent>
                </Card>
              </Grid>

              {/* Delivery Man Details Card */}
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Delivery Man Details</Typography>
                    <Typography variant="body2">Name: {orderData.deliveryman_name}</Typography>
                    <Typography variant="body2">Contact: {orderData.contact}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          ) : (
            <Typography>Loading...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TakeOrderAnchor;