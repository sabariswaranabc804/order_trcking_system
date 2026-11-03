import React from "react";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const CostChart = ({
  totalCost,
  costData,
  COST_COLORS,
  handleOpenCostDialog,
  handleClearCostDetails,
}) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          TOTAL COSTS
        </Typography>
        <Typography variant="h4" color="error" gutterBottom>
          INR {totalCost.toLocaleString("en-IN")}
        </Typography>

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="contained" onClick={handleOpenCostDialog}>
            Update Cost
          </Button>
          <Button variant="outlined" color="error" onClick={handleClearCostDetails}>
            Clear Cost
          </Button>
        </Box>

        <Box sx={{ height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={costData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {costData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COST_COLORS[index % COST_COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CostChart;