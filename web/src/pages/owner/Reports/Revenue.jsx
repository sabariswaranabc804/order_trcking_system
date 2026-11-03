import React from "react";
import { Container, Grid, Box } from "@mui/material";
import useRevenue from "../../../hooks/owner/useRevenue";
import ProfitCard from "../../../components/owner/Reports/ProfitCard";
import ProfitGauge from "../../../components/owner/Reports/ProfitGauge";
import RevenueChart from "../../../components/owner/Reports/RevenueChart";
import CostChart from "../../../components/owner/Reports/CostChart";
import CostDialog from "../../../components/owner/Reports/CostDialog";

function Revenue() {
  const {
    profitPercent,
    revenueData,
    totalRevenue,
    totalCost,
    openCostDialog,
    costDetails,
    costData,
    COLORS,
    COST_COLORS,
    handleOpenCostDialog,
    handleCloseCostDialog,
    handleSaveCostDetails,
    handleClearCostDetails,
    handleCostDetailsChange,
    calculateTotalCost
  } = useRevenue();

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Scrollable content inside the page */}
      <Box sx={{ flex: '1 1 auto', overflowY: 'auto', p: 2 }}>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            {/* Total Profit */}
            <Grid item xs={12} md={6}>
              <ProfitCard totalRevenue={totalRevenue} totalCost={totalCost} />
            </Grid>

            {/* Profit Margin Gauge */}
            <Grid item xs={12} md={6}>
              <ProfitGauge profitPercent={profitPercent} />
            </Grid>

            {/* Revenue Chart */}
            <Grid item xs={12} md={6}>
              <RevenueChart 
                revenueData={revenueData} 
                totalRevenue={totalRevenue} 
                totalCost={totalCost} 
                COLORS={COLORS} 
              />
            </Grid>

            {/* Cost Chart */}
            <Grid item xs={12} md={6}>
              <CostChart 
                totalCost={totalCost}
                costData={costData}
                COST_COLORS={COST_COLORS}
                handleOpenCostDialog={handleOpenCostDialog}
                handleClearCostDetails={handleClearCostDetails}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Cost Dialog */}
      <CostDialog 
        open={openCostDialog}
        onClose={handleCloseCostDialog}
        costDetails={costDetails}
        handleCostDetailsChange={handleCostDetailsChange}
        calculateTotalCost={calculateTotalCost}
        handleSaveCostDetails={handleSaveCostDetails}
      />
    </Box>
  );
}

export default Revenue;