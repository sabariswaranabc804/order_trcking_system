import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import GaugeChart from "react-gauge-chart";

const ProfitGauge = ({ profitPercent }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          PROFIT MARGIN
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <GaugeChart
            id="profit-gauge"
            nrOfLevels={20}
            percent={profitPercent}
            colors={["#FF5F6D", "#FFC371", "#00C49F"]}
            arcWidth={0.3}
            arcPadding={0.02}
            textColor="#4CAF50"
            formatTextValue={(value) => `${Math.round(value)}%`}
          />
        </Box>
        <Typography
          variant="h4"
          textAlign="center"
          color="green"
          sx={{ mt: 2 }}
        >
          {Math.round(profitPercent * 100)}%
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProfitGauge;