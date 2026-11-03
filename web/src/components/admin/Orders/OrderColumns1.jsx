import React from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Checkbox,
  Autocomplete
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { formatPaymentStatus, getStatusColor } from '../../../utils/orderUtils2';
import { updateOrderStatus } from '../../../service/admin/orderService2';
import Swal from 'sweetalert2';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

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
  deliveryman,
  handleOrderClick,
  handleEditClick,

  assignedAnchors,
  setAssignedAnchors,
  handleSendTaskToAnchor,
  userDetails,
  refreshOrders
}) => {
  /* console.log("refreshOrders function available:", !!refreshOrders); */
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
      minWidth: 300,
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
            flexWrap: 'wrap',
            gap: 1
          }}>
            {order.status_Name === "PENDING" && (
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
                      refreshOrders(); // Refresh orders after status update
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
                    Swal.fire({
                      title: 'Are you sure?',
                      text: "You won't be able to revert this action!",
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#d33',
                      cancelButtonColor: '#3085d6',
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
                          refreshOrders(); // Refresh orders after status update
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
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Autocomplete
                  multiple
                  options={deliveryman}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.deliveryman_name}
                  value={assignedAnchors[order.order_id] || []}
                  onChange={(e, newValue) =>
                    setAssignedAnchors((prev) => ({
                      ...prev,
                      [order.order_id]: newValue
                    }))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Assign Anchor"
                      placeholder="Choose anchor"
                    />
                  )}
                  renderOption={(props, option, { selected }) => {
                    const { key, ...optionProps } = props;
                    return (
                      <li key={key} {...optionProps}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.deliveryman_name}
                      </li>
                    );
                  }}
                  sx={{ minWidth: 250, flex: 1, mt: 3 }}
                />

                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    handleSendTaskToAnchor(order.order_id, order.StatusText, order.admin_id).then(response => {
                      /* console.log("Status updated successfully:", response); */
                      if (refreshOrders) {
                        return refreshOrders();
                      }
                    })
                      .catch(error => {
                        /* console.error("Error updating status:", error); */
                      });
                  }
                  }
                  sx={{ flexShrink: 0 }}
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
                {/* <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                    {order.ordertype==='one-way'?`  Order picked by: ${order.deliveryman_name || "N/A"}`:""}
                
                </Typography> */}
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
                    if (refreshOrders) {
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

                  action: "next",
                  ordertype: order.ordertype
                }).then(() => {
                  refreshOrders(); // Refresh orders after status update
                })}
              >
                {order.ordertype === 'one-way' ? 'Mark Ready for Delivery' : " Set Delivery"}
              </Button>
            )}

            {order.status_Name === "READY_FOR_DELIVERY" && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Autocomplete
                  multiple
                  options={deliveryman}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.deliveryman_name}
                  value={assignedAnchors[order.order_id] || []}
                  onChange={(e, newValue) =>
                    setAssignedAnchors((prev) => ({
                      ...prev,
                      [order.order_id]: newValue
                    }))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Assign Anchor"
                      placeholder="Choose anchor"
                    />
                  )}
                  renderOption={(props, option, { selected }) => {
                    const { key, ...optionProps } = props;
                    return (
                      <li key={key} {...optionProps}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.deliveryman_name}
                      </li>
                    );
                  }}
                  sx={{ minWidth: 250, flex: 1, mt: 3 }}
                />

                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={() => handleSendTaskToAnchor(order.order_id, order.StatusText, order.admin_id).then(response => {
                    /* console.log("Status updated successfully:", response); */
                    if (refreshOrders) {
                      return refreshOrders();
                    }
                  })
                    .catch(error => {
                      /* console.error("Error updating status:", error); */
                    })
                  }
                  sx={{ flexShrink: 0 }}
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
                {order.ordertype === 'one-way' ? ` Order delivered by: ${order.deliveryman_name || "N/A"}` : "Delivered"}

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
                  if (refreshOrders) {
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