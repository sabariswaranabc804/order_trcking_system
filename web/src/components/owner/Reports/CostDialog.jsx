import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

const CostDialog = ({
  open,
  onClose,
  costDetails,
  handleCostDetailsChange,
  calculateTotalCost,
  handleSaveCostDetails,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Update Cost Details</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense">
          <InputLabel>Number of Admin</InputLabel>
          <Select
            value={costDetails.admin}
            onChange={(e) => handleCostDetailsChange("admin", e.target.value)}
            label="Number of Admin"
          >
            {[0, 1, 2, 3, 4, 5].map((val) => (
              <MenuItem key={val} value={val}>
                {val}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense">
          <InputLabel>Number of Deliverymen</InputLabel>
          <Select
            value={costDetails.deliverymen}
            onChange={(e) =>
              handleCostDetailsChange("deliverymen", e.target.value)
            }
            label="Number of Deliverymen"
          >
            {[0, 1, 2, 3, 4, 5, 6, 7].map((val) => (
              <MenuItem key={val} value={val}>
                {val}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Other Cost"
          type="number"
          fullWidth
          margin="dense"
          value={costDetails.others}
          onChange={(e) => handleCostDetailsChange("others", e.target.value)}
        />

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Total Cost: ₹{calculateTotalCost(costDetails).toLocaleString("en-IN")}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSaveCostDetails}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CostDialog;