import React from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Select,
  MenuItem,
  useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { formatPaymentStatus, getStatusColor } from '../../../utils/orderUtils2';
import { updateOrderStatus } from '../../../service/admin/orderService2';
import Swal from 'sweetalert2';

const formatDate = (value) => {
  if (!value) return '';
  try {
    const date = new Date(value);
    return date.toLocaleDateString();
  } catch {
    return value;
  }
};

const OrderColumns = ({
  handleOrderClick,
  handleEditClick,
  deliveryman,
  assignedAnchors,
  setAssignedAnchors,
  handleSendTaskToAnchor,
  userDetails,
  refreshOrders
}) => {
  const theme = useTheme();
  
  // Helper function for themed Swal
  const showThemedSwal = (options) => {
    return Swal.fire({
      ...options,
      confirmButtonColor: theme.palette.primary.main,
      cancelButtonColor: theme.palette.error.main,
      background: theme.palette.background.paper,
      color: theme.palette.text.primary
    });
  };
  
  return [
    {
      field: 'order_id',
      headerName: '#Order ID',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Button 
          onClick={() => handleOrderClick(params.row.order_id)}
          sx={{ width: '100%', justifyContent: 'center' }}
        >
          #{params.row.order_id}
        </Button>
      )
    },
    {
      field: 'user_Name',
      headerName: 'Customer',
      minWidth: 180,
      flex: 1,
      headerAlign: 'center',
      renderCell: (params) => (
        <Box sx={{ 
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 1
        }}>
          <Typography 
            sx={{ 
              textAlign: 'center',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              fontWeight: 500,
              textTransform: 'capitalize'
            }}
          >
            {params.row.user_Name}
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block', 
              textAlign: 'center',
              fontSize: { xs: '0.65rem', sm: '0.75rem' },
              color: 'text.secondary'
            }}
          >
            Ph: <b>{params.row.mobile_Number}</b>
          </Typography>
        </Box>
      )
    },
    {
      field: 'order_date',
      headerName: 'Date',
      width: 120,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => formatDate(params.row.order_date),
    },
    {
      field: 'payment',
      headerName: 'Payment Status',
      width: 180,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Box display="flex" alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
          {formatPaymentStatus(params.value)}
          <IconButton onClick={() => handleEditClick(params.row.order_id, params.row.payment)}>
            <EditIcon color="primary" />
          </IconButton>
        </Box>
      )
    },
    {
      field: 'total_item',
      headerName: 'Items',
      width: 80,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'total_price',
      headerName: 'Price',
      width: 100,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'status_Name',
      headerName: 'Status',
      width: 180,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Typography
          sx={{
            color: getStatusColor(params.value),
            width: '100%',
            textAlign: 'center'
          }}
        >
          {params.value}
        </Typography>
      )
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      minWidth: 350,
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const order = params.row;
        return (
          <Box sx={{ 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            p: 1
          }}>
            {order.status_Name=== "PENDING" && (
              <>
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    updateOrderStatus({
                      orderId: order.order_id,
                      oldStatus: order.orderStatus_Id,
                      adminId: userDetails?.user_code,
                      action: "accept"
                    }).then(() => {
                      refreshOrders();
                    });
                  }}
                >
                  Accept
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    showThemedSwal({
                      title: 'Are you sure?',
                      text: "You won't be able to revert this action!",
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonText: 'Yes, reject it!',
                      cancelButtonText: 'No, cancel'
                    }).then((result) => {
                      if (result.isConfirmed) {
                        updateOrderStatus({
                          orderId: order.order_id,
                          oldStatus: order.orderStatus_Id,
                          adminId: userDetails?.user_code,
                          action: "reject"
                        }).then(() => {
                          refreshOrders();
                        });
                      }
                    });
                  }}
                >
                  Reject
                </Button>
              </>
            )}
  
            {order.status_Name === "CONFIRMED" && (
              <Box sx={{ display: "flex", gap: 1, alignItems: "center", width: '100%' }}>
                <Select
                  size="small"
                  value={assignedAnchors[order.order_id]?.[0]?.deliveryman_id || ''}
                  onChange={(e) => {
                    const selected = deliveryman.find(d => d.deliveryman_id === e.target.value);
                    setAssignedAnchors((prev) => ({
                      ...prev,
                      [order.order_id]: selected ? [selected] : []
                    }));
                  }}
                  displayEmpty
                  sx={{ minWidth: 180, flex: 1 }}
                >
                  <MenuItem value="" disabled>
                    <em>Select Deliveryman</em>
                  </MenuItem>
                  {deliveryman.map((person) => (
                    <MenuItem key={person.deliveryman_id} value={person.deliveryman_id}>
                      {person.deliveryman_name}
                    </MenuItem>
                  ))}
                </Select>
  
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  disabled={!assignedAnchors[order.order_id]?.[0]}
                  onClick={() => {
                    handleSendTaskToAnchor(order.order_id, order.StatusText, order.admin_id)
                      .then(response => {
                        /* console.log("Status updated successfully:", response); */
                        if(refreshOrders) {
                          return refreshOrders();
                        }
                      })
                      .catch(error => {
                        /* console.error("Error updating status:", error); */
                      });
                  }} 
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Assign
                </Button>
              </Box>
            )}
  
            {order.status_Name === "PICKUP_ASSIGNED" && (
              <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                Order handled by: {order.deliveryman_name || "N/A"}
              </Typography>
            )}
  
            {order.status_Name === "PICKED_UP" && (
              <>
                <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                  Order picked by: {order.deliveryman_name || "N/A"}
                </Typography>
                <Button
                  size="small"
                  variant="contained"
                  sx={{ ml: 1 }}
                  onClick={() => updateOrderStatus({
                    orderId: order.order_id,
                    oldStatus: order.orderStatus_Id,
                    adminId: userDetails?.user_code,
                    action: "next"
                  }).then(response => {
                    /* console.log("Status updated successfully:", response); */
                    if(refreshOrders) {
                      return refreshOrders();
                    }
                  })
                  .catch(error => {
                    /* console.error("Error updating status:", error); */
                  })
                }
                >
                  Set Processing
                </Button>
              </>
            )}
  
            {order.status_Name === "IN_PROCESSING" && (
              <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={() => updateOrderStatus({
                  orderId: order.order_id,
                  oldStatus: order.orderStatus_Id,
                  adminId: userDetails?.user_code,
                  action: "next"
                }).then(() => {
                    refreshOrders();
                  })}
              >
                Mark Ready for Delivery
              </Button>
            )}
  
            {order.status_Name === "READY_FOR_DELIVERY" && (
              <Box sx={{ display: "flex", gap: 1, alignItems: "center", width: '100%' }}>
                <Select
                  size="small"
                  value={assignedAnchors[order.order_id]?.[0]?.deliveryman_id || ''}
                  onChange={(e) => {
                    const selected = deliveryman.find(d => d.deliveryman_id === e.target.value);
                    setAssignedAnchors((prev) => ({
                      ...prev,
                      [order.order_id]: selected ? [selected] : []
                    }));
                  }}
                  displayEmpty
                  sx={{ minWidth: 180, flex: 1 }}
                >
                  <MenuItem value="" disabled>
                    <em>Select Deliveryman</em>
                  </MenuItem>
                  {deliveryman.map((person) => (
                    <MenuItem key={person.deliveryman_id} value={person.deliveryman_id}>
                      {person.deliveryman_name}
                    </MenuItem>
                  ))}
                </Select>
  
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  disabled={!assignedAnchors[order.order_id]?.[0]}
                  onClick={() => {
                    handleSendTaskToAnchor(order.order_id, order.StatusText, order.admin_id)
                      .then(response => {
                        /* console.log("Status updated successfully:", response); */
                        if(refreshOrders) {
                          return refreshOrders();
                        }
                      })
                      .catch(error => {
                        /* console.error("Error updating status:", error); */
                      });
                  }}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Assign
                </Button>
              </Box>
            )}
  
            {order.status_Name === "DELIVERY_ASSIGNED" && (
              <Typography variant="body2">
                Order handled by: {order.deliveryman_name || "N/A"}
              </Typography>
            )}
  
            {order.status_Name === "OUT_FOR_DELIVERY" && (
              <Typography variant="body2">
                Order dropped by: {order.deliveryman_name || "N/A"}
              </Typography>
            )}
  
            {order.status_Name === "DELIVERED" && (
              <Typography variant="body2">
                Order delivered by: {order.deliveryman_name || "N/A"}
              </Typography>
            )}
  
            {order.status_Name === "CANCELLED" && (
              <Typography variant="body2">
                Cancelled by: {order.cancelledBy || "User"}
              </Typography>
            )}
  
            {order.status_Name === "REJECTED" && (
              <Button
                size="small"
                variant="contained"
                onClick={() => updateOrderStatus({
                  orderId: order.order_id,
                  oldStatus: order.orderStatus_Id,
                  adminId: userDetails?.user_code,
                  action: "next"
                }).then(response => {
                    /* console.log("Status updated successfully:", response); */
                    if(refreshOrders) {
                      return refreshOrders();
                    }
                  })
                  .catch(error => {
                    /* console.error("Error updating status:", error); */
                  })}
              >
                Mark as Confirmed
              </Button>
            )}
          </Box>
        );
      },
    },
  ];
};

export default OrderColumns;
