import React from 'react'
import Card from './AnchorCard'
import { FaUsers, FaShoppingCart, FaTicketAlt } from 'react-icons/fa'
import { Line } from 'react-chartjs-2'
import { FaPerson } from 'react-icons/fa6'
import { Box, Grid, Paper, Typography, useTheme, Avatar, Stack, Divider } from '@mui/material'
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from 'recharts'
import { Chart as ChartJS, LineElement, BarElement, CategoryScale, LinearScale, PointElement } from 'chart.js'
import CountUp from 'react-countup'
import useAnchorDashboard from '../../../hooks/anchor/useAnchorDashboard'
import { Dashboard, TrendingUp, People, LocalShipping, CheckCircle } from '@mui/icons-material'

// Register ChartJS components
ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement)

const AnchorDashboard = () => {
  const theme = useTheme()
  const {
    user,
    customer,
    loading,
    rows,
    countStatus2,
    countStatus3,
    countStatus5,
    pieData,
    lineData,
    chartOptions,
    COLORS,
  } = useAnchorDashboard()

  if (loading || !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography variant="h6" color="text.secondary">Loading dashboard...</Typography>
      </Box>
    )
  }

  const statsCards = [
    {
      icon: <People sx={{ fontSize: 40 }} />,
      title: 'Customers',
      value: customer.length,
      color: theme.palette.primary.main,
      bgColor: `${theme.palette.primary.main}15`,
    },
    {
      icon: <LocalShipping sx={{ fontSize: 40 }} />,
      title: 'Delivery Personnel',
      value: rows.length,
      color: theme.palette.secondary.main,
      bgColor: `${theme.palette.secondary.main}15`,
    },
    {
      icon: <FaTicketAlt style={{ fontSize: 32 }} />,
      title: 'Picked Orders',
      value: countStatus2,
      color: theme.palette.warning.main,
      bgColor: `${theme.palette.warning.main}15`,
    },
    {
      icon: <CheckCircle sx={{ fontSize: 40 }} />,
      title: 'Delivered Orders',
      value: countStatus5,
      color: theme.palette.success.main,
      bgColor: `${theme.palette.success.main}15`,
    },
  ]

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Avatar 
            sx={{ 
              width: 56, 
              height: 56, 
              bgcolor: 'primary.main',
              fontSize: '1.5rem',
              fontWeight: 600
            }}
          >
            {user.user_Name?.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
              Welcome, {user.user_Name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Dashboard sx={{ fontSize: 20, color: 'primary.main' }} />
              <Typography variant="body1" sx={{ color: 'primary.main', fontWeight: 500 }}>
                Anchor Dashboard
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: stat.bgColor,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[6],
                  borderColor: stat.color,
                },
              }}
            >
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      bgcolor: 'background.paper',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <TrendingUp sx={{ color: stat.color, fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>
                    <CountUp end={stat.value} duration={2} />
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        {/* Line Chart */}
        <Grid item xs={12} lg={7}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              height: '100%',
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              minHeight: { xs: 300, md: 450 }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <TrendingUp color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Orders Trend
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ height: { xs: 250, md: 350 } }}>
              <Line 
                data={lineData} 
                options={{
                  ...chartOptions,
                  maintainAspectRatio: false,
                  responsive: true,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      display: true,
                      position: 'top',
                    }
                  }
                }} 
              />
            </Box>
          </Paper>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} lg={5}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              height: '100%',
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              minHeight: { xs: 300, md: 450 }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Dashboard color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Working Status
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              height: { xs: 250, md: 350 }
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius="70%"
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 8,
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    wrapperStyle={{
                      paddingTop: '20px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AnchorDashboard
