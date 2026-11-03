import React from 'react';
import { 
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Button, Typography, Tabs, Tab, TextField, IconButton, Dialog, DialogTitle, 
  DialogContent, DialogActions, Select, MenuItem, Card, CardContent, Grid, Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useOrderManagement } from '../../../hooks/admin/orderList/useOrderManagement';
import { useOrderDetails } from '../../../hooks/admin/orderList/useOrderDetails';
import { usePaymentEdit } from '../../../hooks/admin/orderList/usePaymentEdit';
import { useOrderFilters } from '../../../hooks/admin/orderList/useOrderFilters';
import { getStatusColor, formatPaymentStatus } from '../../../utils/orderUtils';
// Add this import at the top of the file if not already present
import { DataGrid } from '@mui/x-data-grid';
import OrderListColumns from '../../../components/admin/Orders/OrderColumns1';
import {   useMediaQuery } from '@mui/material';

const OrderList = () => {
  const navigate = useNavigate();
  const { user: userDetails } = useAuth();
  const companyId = userDetails?.company_Id;
  
  // Custom hooks for different functionalities
  const { 
    orders, 
    assignedAnchors,
    deliveryman,
   
    setAssignedAnchors,
    handleGetReadyDrop, 
    handleSetCompleted, 
    handleSendTaskToAnchor,
    handleUpdatePayment , refreshOrders  
  } = useOrderManagement(companyId,"self-service");
  
  const { 
    selectedOrder, 
    orderData, 
    products, 
    open, 
    handleOrderClick, 
    handleClose 
  } = useOrderDetails();
  
  const { 
    editOpen, 
    selectedOrderId, 
    selectedPayment, 
    handleEditClick, 
    handleEditClose, 
    handlePaymentChange, 
    handleSubmit 
  } = usePaymentEdit(refreshOrders);
  
  const { 
    filteredStatus, 
    searchQuery, 
    startDate, 
    endDate, 
    filteredOrders, 
    handleStatusChange, 
    handleSearch, 
    handleStartDateChange, 
    handleEndDateChange 
  } = useOrderFilters(orders);
  //console.log("filteredOrders", filteredOrders  );
  const columns = OrderListColumns({
    deliveryman,
    handleOrderClick,
    handleEditClick,
    assignedAnchors,
  setAssignedAnchors,

    handleGetReadyDrop,
    handleSetCompleted,
    handleSendTaskToAnchor, refreshOrders  
  });
  const isSmallScreen = useMediaQuery('(max-width:960px)');
  return (
    <Box p={3}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h5" gutterBottom sx={{marginTop:"6px"}}>
          Self Service
        </Typography>
      </div>
      
      {/* Filter tabs */}
      <Tabs
       value={filteredStatus}
       onChange={handleStatusChange}
       variant={isSmallScreen ? 'scrollable' : ''}
       scrollButtons={isSmallScreen ? 'auto' : false}
     >
       <Tab
         label={`All(${orders.length})`}
         value="All"
         sx={{ fontSize: '0.75rem' }}
       />
       {[
        
         "PICKED_UP",
         "IN_PROCESSING",
        
         "DELIVERED",
        
       ].map((status) => (
         <Tab
           key={status}
           label={`${status} (${orders.filter(o => o.status_Name === status).length})`}
           value={status}
           sx={{ fontSize: '0.75rem' }}
         />
       ))}
     </Tabs>
      
      {/* Date filters and search */}
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
          label="Search Name or Email..."
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

      {/* Orders table */}
   
      <Box sx={{ height: 700, width: '100%', overflow: 'auto' }}>
        <DataGrid
          rows={filteredOrders}
          getRowId={(row) => row.order_id}
          columns={columns}
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
          autoPageSize={false}
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

export default OrderList;