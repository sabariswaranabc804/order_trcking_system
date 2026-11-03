import React from "react";
import { Button, Grid, Card, Typography } from "@mui/material";

const ServiceItems = ({ serviceType, serviceItems, handleItemClick }) => {
  if (!serviceType || !serviceItems[serviceType]) return null;
  
  return (
    <Grid item xs={12}>
      <Card sx={{ padding: 2 }}>
        <Typography variant="h6">Select Items</Typography>
        <Grid container spacing={1}>
          {serviceItems[serviceType].map((item, index) => (
            <Grid item key={index}>
              <Button variant="outlined" onClick={() => handleItemClick(item)}>
                {item.servSubType_Name} - ₹{item.rate}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Card>
    </Grid>
  );
};

export default ServiceItems;