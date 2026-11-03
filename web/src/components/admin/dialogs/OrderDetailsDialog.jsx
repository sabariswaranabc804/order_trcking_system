import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import MapIcon from '@mui/icons-material/Map';
import { openGoogleMaps, dialPhoneNumber } from '../../../utils/orderUtils2';

const OrderDetailsDialog = ({
  open,
  handleClose,
  orderData,
  products
}) => {
  return (
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
                  {/* <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      sx={{fontSize:"8"}}
                      startIcon={<PhoneIcon />}
                      onClick={() => dialPhoneNumber(orderData.mobile_number)}
                    >
                      Call Phone Number
                    </Button>

                    <Button  
                      variant="contained" 
                      sx={{ backgroundColor: 'rgba(255, 112, 3, 0.69)', color: "white", fontSize:"8"}}
                      startIcon={<MapIcon />}
                      onClick={() => openGoogleMaps(orderData.longitude, orderData.lattitude, orderData.address[0])}
                    >
                      Open Map
                    </Button>
                  </Box> */}
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
  );
};

export default OrderDetailsDialog;