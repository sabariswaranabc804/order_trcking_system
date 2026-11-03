import React from "react";
import { MenuItem, Select, Grid, Card, Typography } from "@mui/material";

const ServiceTypeSelection = ({ serviceType, serviceItems, handleServiceChange }) => {
  return (
    <Grid item xs={6}>
      <Card sx={{ padding: 2 }}>
        <Typography variant="h6">Service Type</Typography>
        <Select fullWidth value={serviceType} onChange={handleServiceChange} displayEmpty>
          {Object.keys(serviceItems).map((service, index) => (
            <MenuItem key={index} value={service}>
              {service}
            </MenuItem>
          ))}
        </Select>
      </Card>
    </Grid>
  );
};

export default ServiceTypeSelection;