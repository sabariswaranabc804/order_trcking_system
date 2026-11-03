import React, { use, useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  IconButton,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  OutlinedInput,
  ListItemText,
  MenuItem,
  Button,
  useTheme,
  useMediaQuery,
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import EditIcon from '@mui/icons-material/Edit';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

import { useOrderManagement } from '../../../hooks/admin/orderList2/useOrderManagement';
import { useOrderDetails } from '../../../hooks/admin/orderList2/useOrderDetails';
import { usePaymentEdit } from '../../../hooks/admin/orderList2/usePaymentEdit';
import { useOrderFilters } from '../../../hooks/admin/orderList2/useOrderFilters';
import { useNotifications } from '../../../hooks/admin/orderList2/useNotification';

import { getStatusColor, formatPaymentStatus } from '../../../utils/orderUtils2';
import { updateOrderStatus } from '../../../service/admin/orderService2';
import NotificationDialog from '../../../components/admin/dialogs/NotificationDialog';
import PaymentEditDialog from '../../../components/admin/dialogs/PaymentEditDialog';
import OrderDetailsDialog from '../../../components/admin/dialogs/OrderDetailsDialog';
import OrderColumns from '../../../components/admin/Orders/OrderColumns';

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
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const OrderList = () => {
  const theme = useTheme();
  const { user: userDetails } = useAuth();
  const companyId = userDetails?.company_Id;
  /* console.log("dsf", userDetails); */

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


  const {
    orders,
    deliveryman,
    assignedAnchors,
    rejectorder,
    setAssignedAnchors,
    handleGetReadyDrop,
    handleSetCompleted,
    handleSendTaskToAnchor,
    handleUpdatePayment, refreshOrders  // Get the refresh function
  } = useOrderManagement(companyId);


  const {
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



  const {
    anchorEl,
    dialogOpen,
    selectedNotification,
    handleIconClick,
    handlePopoverClose,
    handleNotificationClick,
    handleDialogClose
  } = useNotifications(rejectorder);

  // Columns for DataGrid
  // Remove the columns definition from here and use the imported component
  const columns = OrderColumns({
    handleOrderClick,
    handleEditClick,
    deliveryman,
    assignedAnchors,
    setAssignedAnchors,
    handleSendTaskToAnchor,
    userDetails,
    refreshOrders  // Pass the refresh function
  });

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        bgcolor: theme.palette.background.default,
        minHeight: '100vh'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary
          }}
        >
          Two-Way Service Orders
        </Typography>

        <NotificationDialog
          rejectorder={rejectorder}
          anchorEl={anchorEl}
          dialogOpen={dialogOpen}
          selectedNotification={selectedNotification}
          handleIconClick={handleIconClick}
          handlePopoverClose={handlePopoverClose}
          handleNotificationClick={handleNotificationClick}
          handleDialogClose={handleDialogClose}
        />
      </Box>

      {/* Filter Tabs */}
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
            label={`All (${orders.length})`}
            value="All"
          />
          {[
            "PENDING",
            "CONFIRMED",
            "PICKUP_ASSIGNED",
            "PICKED_UP",
            "IN_PROCESSING",
            "READY_FOR_DELIVERY",
            "DELIVERY_ASSIGNED",
            "OUT_FOR_DELIVERY",
            "DELIVERED",
            "CANCELLED",
            "REJECTED",
          ].map((status) => (
            <Tab
              key={status}
              label={`${status.replace(/_/g, ' ')} (${orders.filter(o => o.status_Name === status).length})`}
              value={status}
            />
          ))}
        </Tabs>
      </Paper>

      {/* Filters */}
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
              fullWidth={isMobile}
              sx={{ minWidth: { sm: 180 } }}
            />
            <TextField
              label="End date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={handleEndDateChange}
              size="small"
              fullWidth={isMobile}
              sx={{ minWidth: { sm: 180 } }}
            />
          </Box>
          <TextField
            label="Search Name or Email..."
            value={searchQuery}
            onChange={handleSearch}
            size="small"
            fullWidth={isMobile}
            sx={{
              minWidth: { md: 300 },
              maxWidth: { md: 400 }
            }}
            InputProps={{
              endAdornment: (
                <IconButton size="small">
                  <SearchIcon />
                </IconButton>
              )
            }}
          />
        </Box>
      </Paper>

      {/* DataGrid */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            height: { xs: 500, sm: 600, md: 700 },
            width: '100%'
          }}
        >
          <DataGrid
            rows={filteredOrders}
            getRowId={(row) => row.order_id}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 20 }
              }
            }}
            pageSizeOptions={[10, 20, 50, 100]}
            pagination
            disableSelectionOnClick
            rowHeight={80}
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell': {
                borderColor: theme.palette.divider,
                color: theme.palette.text.primary,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                padding: { xs: '8px', sm: '16px' }
              },
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: theme.palette.mode === 'dark'
                  ? 'rgba(122, 215, 204, 0.08)'
                  : 'rgba(65, 179, 163, 0.05)',
                borderColor: theme.palette.divider,
                color: theme.palette.text.primary,
                fontWeight: 600,
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              },
              '& .MuiDataGrid-row': {
                '&:hover': {
                  bgcolor: theme.palette.action.hover
                },
                '&.Mui-selected': {
                  bgcolor: theme.palette.action.selected,
                  '&:hover': {
                    bgcolor: theme.palette.action.selected
                  }
                }
              },
              '& .MuiDataGrid-footerContainer': {
                borderColor: theme.palette.divider,
                bgcolor: theme.palette.background.paper
              },
              '& .MuiTablePagination-root': {
                color: theme.palette.text.primary
              },
              '& .MuiDataGrid-virtualScroller': {
                overflowX: 'auto'
              },
              // Make table scrollable on small screens
              '& .MuiDataGrid-main': {
                minWidth: { xs: '800px', md: '100%' }
              }
            }}
          />
        </Box>
      </Paper>


      <PaymentEditDialog
        editOpen={editOpen}
        selectedOrderId={selectedOrderId}
        selectedPayment={selectedPayment}
        handleEditClose={handleEditClose}
        handlePaymentChange={handlePaymentChange}
        handleSubmit={handleSubmit}
      />

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


