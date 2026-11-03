import React from "react";
import {
  Button,
  Grid,
  Card,
  Typography,
  IconButton,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { QRCodeCanvas } from "qrcode.react";

const OrderSummary = ({
  selectedItems,
  totalPrice,
  paymentStatus,
  qrData,
  orderServiceType,
  setPaymentStatus,
  setOrderServiceType,
  generateQRCode,
  cancelQRCode,
  handleOrderSubmit,
  handleQuantityChange,
  handleDeleteItem
}) => {
  if (selectedItems.length === 0) return null;

  return (
    <Grid item xs={12}>
      <Card sx={{ padding: 2 }}>
        <Typography variant="h6">Order Summary</Typography>
        <Typography variant="h6">Total Price: ₹{totalPrice}</Typography>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "10px", flexWrap: "wrap" }}>
          {/* Payment Status Radio Buttons */}
          <FormControl component="fieldset">
            <FormLabel component="legend">Payment Status</FormLabel>
            <RadioGroup
              row
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
            >
              <FormControlLabel value="Paid" control={<Radio />} label="Paid" />
              <FormControlLabel value="Pending" control={<Radio />} label="Pending" />
            </RadioGroup>
          </FormControl>

          {/* Vertical Divider */}
          <div style={{ height: "60px", width: "1px", backgroundColor: "#e0e0e0", margin: "0 10px" }}></div>

          {/* Service Type Radio Buttons */}
          <FormControl component="fieldset">
            <FormLabel component="legend">Service Type</FormLabel>
            <RadioGroup
              row
              value={orderServiceType}
              onChange={(e) => setOrderServiceType(e.target.value)}
            >
              <FormControlLabel value="self-service" control={<Radio />} label="Self Service" />
              <FormControlLabel value="one-way" control={<Radio />} label="One-Way Service" />
            </RadioGroup>
          </FormControl>

          {/* Vertical Divider */}
          <div style={{ height: "60px", width: "1px", backgroundColor: "#e0e0e0", margin: "0 10px" }}></div>

          {/* Generate QR Code Button */}
          <Button variant="contained" color="secondary" onClick={generateQRCode}>
            Generate QR Code
          </Button>

          {/* Cancel QR Code Button */}
          {qrData && (
            <>
              {/* Vertical Divider */}
              <div style={{ height: "40px", width: "1px", backgroundColor: "#e0e0e0", margin: "0 10px" }}></div>
              <Button variant="outlined" color="error" onClick={cancelQRCode}>
                Cancel QR Code
              </Button>
            </>
          )}

          {/* Vertical Divider */}
          <div style={{ height: "40px", width: "1px", backgroundColor: "#e0e0e0", margin: "0 10px" }}></div>

          {/* Order Submit Button */}
          <Button variant="contained" color="primary" onClick={handleOrderSubmit}>
            Submit Order
          </Button>
        </div>

        {/* QR Code Display */}
        {qrData && (
          <Grid item xs={12}>
            <Card sx={{ padding: 2, textAlign: "center" }}>
              <Typography variant="h6">QR Code</Typography>
              <QRCodeCanvas sx={{ textAlign: "center" }} value={qrData} size={150} />
            </Card>
          </Grid>
        )}

        <DataGrid
          rows={[...selectedItems]
            .sort((a, b) => b.id - a.id)
            .map((item) => ({
              id: item.id,
              name: item.servSubType_Name,
              quantity: item.quantity,
              rate: item.rate,
              price: item.rate * item.quantity,
              category_Name: item.serv_Name,
            }))}
          columns={[
            { field: "name", headerName: "Item", width: 150 },
            { field: "category_Name", headerName: "Category_Name", width: 150 },
            {
              field: "quantity",
              headerName: "Qty",
              width: 130,
              renderCell: (params) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconButton onClick={() => handleQuantityChange(params.row.id, -1)}>
                    <RemoveIcon />
                  </IconButton>
                  <Typography>{params.row.quantity}</Typography>
                  <IconButton onClick={() => handleQuantityChange(params.row.id, 1)}>
                    <AddIcon />
                  </IconButton>
                </div>
              ),
            },
            { field: "rate", headerName: "Rate", width: 100 },
            { field: "price", headerName: "Total Price", width: 100 },
            {
              field: "actions",
              headerName: "Actions",
              width: 100,
              renderCell: (params) => (
                <IconButton color="error" onClick={() => handleDeleteItem(params.row.id)}>
                  <DeleteIcon />
                </IconButton>
              ),
            },
          ]}
          autoHeight
        />
      </Card>
    </Grid>
  );
};

export default OrderSummary;