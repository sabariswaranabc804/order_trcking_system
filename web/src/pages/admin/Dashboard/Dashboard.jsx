import React from 'react'
import Card from './Card'
import { FaShoppingCart, FaTicketAlt, FaUsers } from 'react-icons/fa'
import { Line } from 'react-chartjs-2'
import { FaPerson } from 'react-icons/fa6'
import { Box, Grid, Paper, Typography } from '@mui/material'
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts'
import { Chart as ChartJS, LineElement, BarElement, CategoryScale, LinearScale, PointElement } from 'chart.js'
import CountUp from 'react-countup'
import useDashboard from '../../../hooks/admin/useDashboard'
import ChartErrorBoundary from '../../../components/common/ChartErrorBoundary'

// Register ChartJS components
ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement)

const Dashboard = () => {
  const {
    user,
    customers,
    deliverymen,
    loading,
    countStatus2,
    countStatus3,
    countStatus5,
    data,
    dataLine,
    options,
    COLORS
  } = useDashboard();

  // Enhanced loading check to ensure all data is ready
  if (loading || !user || !dataLine || !dataLine.datasets || !data) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Typography variant="h6">Loading dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, flexGrow: 1 }}>
      <Box sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
        <Typography variant="h4" sx={{ mt: 3 }}>
          {user.user_Name} Dashboard <Box component="span" sx={{ color: 'primary.main' }}>(Admin)</Box>
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={2.4}>
          <Card icon={<FaUsers />} title="Customer" value={<CountUp end={customers.length} duration={2} />} />
        </Grid>
        <Grid item xs={2.4}>
          <Card icon={<FaPerson />} title="DeliveryMan" value={<CountUp end={deliverymen.length} duration={2} />} />
        </Grid>
        <Grid item xs={2.4}>
          <Card icon={<FaTicketAlt />} title="Pending Order" value={<CountUp end={countStatus2} duration={2} />} />
        </Grid>
        <Grid item xs={2.4}>
          <Card icon={<FaTicketAlt />} title="In Progress" value={<CountUp end={countStatus3} duration={2} />} />
        </Grid>
        <Grid item xs={2.4}>
          <Card icon={<FaShoppingCart />} title="Delivered Order" value={<CountUp end={countStatus5} duration={2} />} />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Orders Data</Typography>
            <ChartErrorBoundary>
              {dataLine && dataLine.datasets && dataLine.datasets.length > 0 ? (
                <Box sx={{ height: 300 }}>
                  <Line data={dataLine} options={options} />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                  <Typography variant="body2" color="text.secondary">
                    No order data available
                  </Typography>
                </Box>
              )}
            </ChartErrorBoundary>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Working Status</Typography>
            <ChartErrorBoundary>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {data && data.length > 0 ? (
                  <PieChart width={400} height={400}>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                    <Typography variant="body2" color="text.secondary">
                      No status data available
                    </Typography>
                  </Box>
                )}
              </Box>
            </ChartErrorBoundary>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;