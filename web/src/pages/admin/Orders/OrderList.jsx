import React from 'react';
import { 
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Button,   useTheme,Typography, Tabs, Tab, TextField, IconButton, Dialog, DialogTitle, 
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
import OrderDetailsDialog from '../../../components/admin/dialogs/OrderDetailsDialog';

const OrderList = () => {
  const navigate = useNavigate();
  const { user: userDetails } = useAuth();
  const companyId = userDetails?.company_Id;
    const theme = useTheme();
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
  } = useOrderManagement(companyId,"one-way");
  
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
         One-Way service
        </Typography>
      </div>
      
      {/* Filter tabs */}
      <Paper
              elevation={0}
        sx={{
          mb: 3,
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          overflow: 'hidden'
        }}>
   <Tabs
       value={filteredStatus}
       onChange={handleStatusChange}
     variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              minHeight: 48,
              fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
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
       <Tab
         label={`All(${orders.length})`}
         value="All"
         sx={{ fontSize: '0.75rem' }}
       />
       {[
        
         "PICKED_UP",
         "IN_PROCESSING",
         "READY_FOR_DELIVERY",
         "DELIVERY_ASSIGNED",
         "OUT_FOR_DELIVERY",
        
       ].map((status) => (
         <Tab
           key={status}
           label={`${status} (${orders.filter(o => o.status_Name === status).length})`}
           value={status}
           sx={{ fontSize: '0.75rem' }}
         />
       ))}
     </Tabs>
      </Paper>
   
      
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
     <OrderDetailsDialog
        open={open}
        handleClose={handleClose}
        orderData={orderData}
        products={products}
      />
    </Box>
  );
};

export default OrderList;