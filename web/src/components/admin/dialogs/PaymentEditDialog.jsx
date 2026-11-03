import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Select,
  MenuItem
} from '@mui/material';

const PaymentEditDialog = ({
  editOpen,
  selectedOrderId,
  selectedPayment,
  handleEditClose,
  handlePaymentChange,
  handleSubmit
}) => {
  return (
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
  );
};

export default PaymentEditDialog;