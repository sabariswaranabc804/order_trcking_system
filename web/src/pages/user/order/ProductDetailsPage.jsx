import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Box,
  useTheme,
  Divider,
  Chip,
  Alert
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from "@mui/lab";
import {
  CheckCircleOutline,
  LocalShipping,
  DirectionsCar,
  Home,
  LocationOn as LocationOnIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  ReceiptLong as ReceiptLongIcon,
  Cancel as CancelIcon
} from "@mui/icons-material";
import UserNavbar from "../Home/UserNavbar";
import { useAuth } from "../../../context/AuthContext";
import { useOrderDetails } from "../../../hooks/user/useOrderDetails";
import { updateOrderStatus } from "../../../service/admin/orderService2";

function ProductDetailsPage() {
  const location = useLocation();
  const { orderId } = location.state;
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
  const userId = user?.user_code;

  const {
    orderData,
    products,
    handleCancelOrder,
    handleSetCompleted
  } = useOrderDetails({ orderId, userId, navigate });

  if (!orderData) {
    return (
      <>
        <UserNavbar />
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: theme.palette.background.default
        }}>
          <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
            Loading order details...
          </Typography>
        </Box>
      </>
    );
  }

  const getStatusColor = (status, step) => {
    if (status >= step) {
      return theme.palette.primary.main;
    }
    return theme.palette.action.disabled;
  };

  const getStatusLabel = (statusId) => {
    const labels = {
      1: "Order Placed",
      2: "Ready to Pick",
      3: "Order Picked",
      4: "Ready to Deliver",
      5: "En Route",
      6: "Delivered",
      7: "Completed"
    };
    return labels[statusId] || "Unknown";
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
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <ReceiptLongIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />
                Order Details
              </Typography>
              <Chip
                label={`Order #${orderId}`}
                color="primary"
                sx={{ fontWeight: 600 }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, ml: 5 }}>
              Track your order status and view details
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Order Status Timeline */}
            <Grid item xs={12} lg={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  bgcolor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  height: '100%'
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    fontWeight: 600,
                    color: theme.palette.text.primary
                  }}
                >
                  Order Status
                </Typography>

                {/* <Alert
                  severity={orderData.orderStatus_Id >= 6 ? "success" : "info"}
                  sx={{ mb: 3 }}
                >
                  Current Status: <strong>{getStatusLabel(orderData.orderStatus_Id)}</strong>
                </Alert> */}

                <Timeline position="right" sx={{ p: 0 }}>
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot
                        sx={{
                          bgcolor: getStatusColor(orderData.orderStatus_Id, 1),
                          boxShadow: orderData.orderStatus_Id >= 1 ? `0 0 0 4px ${theme.palette.primary.main}20` : 'none'
                        }}
                      >
                        <CheckCircleOutline sx={{ fontSize: 20 }} />
                      </TimelineDot>
                      <TimelineConnector sx={{ bgcolor: getStatusColor(orderData.orderStatus_Id, 2) }} />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: orderData.orderStatus_Id === 1 ? 600 : 400,
                          color: orderData.orderStatus_Id >= 1 ? theme.palette.text.primary : theme.palette.text.disabled
                        }}
                      >
                        Order Placed
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>

                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot
                        sx={{
                          bgcolor: getStatusColor(orderData.orderStatus_Id, 3),
                          boxShadow: orderData.orderStatus_Id >= 3 ? `0 0 0 4px ${theme.palette.primary.main}20` : 'none'
                        }}
                      >
                        <LocalShipping sx={{ fontSize: 20 }} />
                      </TimelineDot>
                      <TimelineConnector sx={{ bgcolor: getStatusColor(orderData.orderStatus_Id, 4) }} />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: orderData.orderStatus_Id === 3 ? 600 : 400,
                          color: orderData.orderStatus_Id >= 3 ? theme.palette.text.primary : theme.palette.text.disabled
                        }}
                      >
                        Order Picked
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>

                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot
                        sx={{
                          bgcolor: getStatusColor(orderData.orderStatus_Id, 5),
                          boxShadow: orderData.orderStatus_Id >= 5 ? `0 0 0 4px ${theme.palette.primary.main}20` : 'none'
                        }}
                      >
                        <DirectionsCar sx={{ fontSize: 20 }} />
                      </TimelineDot>
                      <TimelineConnector sx={{ bgcolor: getStatusColor(orderData.orderStatus_Id, 6) }} />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: orderData.orderStatus_Id === 5 ? 600 : 400,
                          color: orderData.orderStatus_Id >= 5 ? theme.palette.text.primary : theme.palette.text.disabled
                        }}
                      >
                        En Route
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>

                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot
                        sx={{
                          bgcolor: getStatusColor(orderData.orderStatus_Id, 6),
                          boxShadow: orderData.orderStatus_Id >= 6 ? `0 0 0 4px ${theme.palette.primary.main}20` : 'none'
                        }}
                      >
                        <Home sx={{ fontSize: 20 }} />
                      </TimelineDot>
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: orderData.orderStatus_Id === 6 ? 600 : 400,
                          color: orderData.orderStatus_Id >= 6 ? theme.palette.text.primary : theme.palette.text.disabled
                        }}
                      >
                        Delivered
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                </Timeline>
              </Paper>
            </Grid>

            {/* Products & Actions */}
            <Grid item xs={12} lg={5}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  bgcolor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontWeight: 600,
                    color: theme.palette.text.primary
                  }}
                >
                  Order Items
                </Typography>

                <TableContainer sx={{ maxHeight: 400, mb: 2 }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ bgcolor: theme.palette.background.paper, color: theme.palette.text.primary, fontWeight: 600 }}>
                          Product
                        </TableCell>
                        <TableCell sx={{ bgcolor: theme.palette.background.paper, color: theme.palette.text.primary, fontWeight: 600 }}>
                          Category
                        </TableCell>
                        <TableCell align="right" sx={{ bgcolor: theme.palette.background.paper, color: theme.palette.text.primary, fontWeight: 600 }}>
                          Rate
                        </TableCell>
                        <TableCell align="center" sx={{ bgcolor: theme.palette.background.paper, color: theme.palette.text.primary, fontWeight: 600 }}>
                          Qty
                        </TableCell>
                        <TableCell align="right" sx={{ bgcolor: theme.palette.background.paper, color: theme.palette.text.primary, fontWeight: 600 }}>
                          Total
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products.map((p, i) => (
                        <TableRow key={i} hover>
                          <TableCell sx={{ color: theme.palette.text.primary }}>{p.product_name}</TableCell>
                          <TableCell sx={{ color: theme.palette.text.secondary }}>{p.category_name}</TableCell>
                          <TableCell align="right" sx={{ color: theme.palette.text.primary }}>₹{p.rate}</TableCell>
                          <TableCell align="center" sx={{ color: theme.palette.text.primary }}>{p.quantity}</TableCell>
                          <TableCell align="right" sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>₹{p.total_price}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                    Total Amount
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                    ₹{orderData.total_price}
                  </Typography>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                  {orderData.orderStatus_Id < 2 && (
                    <Button
                      variant="contained"
                      color="error"
                      fullWidth
                      size="large"
                      startIcon={<CancelIcon />}
                      onClick={async () => {
                        await updateOrderStatus({
                          orderId: orderData.order_id,
                          oldStatus: orderData.orderStatus_Id,
                          action: "cancel",
                        });
                        navigate(-1);
                      }}
                    >
                      Cancel Order
                    </Button>
                  )}
                  {orderData.orderStatus_Id === 7 && (
                    <Button
                      variant="contained"
                      color="success"
                      fullWidth
                      size="large"
                      onClick={async () => {
                        await updateOrderStatus({
                          orderId: orderData.order_id,
                          oldStatus: orderData.orderStatus_Id
                        });
                        navigate(-1);
                      }}
                    >
                      Mark as Completed
                    </Button>
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* Address & Delivery Info */}
            <Grid item xs={12} lg={3}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Delivery Address */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <LocationOnIcon sx={{ color: theme.palette.primary.main }} />
                    Delivery Address
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.primary,
                      mb: 0.5,
                      textTransform: 'capitalize'
                    }}
                  >
                    {orderData.Street}, {orderData.Floor_Door_no}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      textTransform: 'capitalize'
                    }}
                  >
                    {orderData.Area}, {orderData.city_Id}
                  </Typography>
                </Paper>

                {/* Delivery Person */}
                {orderData.deliveryman_name && (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      bgcolor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 2
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <PersonIcon sx={{ color: theme.palette.primary.main }} />
                      Delivery Person
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.text.primary,
                          fontWeight: 500
                        }}
                      >
                        {orderData.deliveryman_name}
                      </Typography>
                    </Box>
                    {orderData.contact && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                        <Typography
                          variant="body2"
                          sx={{ color: theme.palette.text.secondary }}
                        >
                          {orderData.contact}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}

export default ProductDetailsPage;
