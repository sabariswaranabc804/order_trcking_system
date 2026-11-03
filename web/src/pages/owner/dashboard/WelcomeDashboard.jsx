import { useUserData } from '../../../hooks/owner/useUserData';
import { Box, Grid, Paper, Typography, useTheme } from '@mui/material';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FaShoppingCart, FaBox, FaUsers, FaCog, FaChartLine } from 'react-icons/fa';
import CountUp from 'react-countup';
import { useOrders } from '../../../hooks/owner/useOrders';
import { useCustomers } from '../../../hooks/owner/useCustomers';
import { useDeliverymen } from '../../../hooks/owner/useDeliverymen';
import { useUserCounts } from '../../../hooks/owner/useUserCounts';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);



// === Card UI Component ===
const StatCard = ({ icon, title, value, theme }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: 2,
      display: 'flex',
      alignItems: 'center',
      bgcolor: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.palette.mode === 'dark'
          ? '0 8px 24px rgba(0,0,0,0.4)'
          : '0 8px 24px rgba(0,0,0,0.12)',
        borderColor: theme.palette.primary.main,
      }
    }}
  >
    <Box
      sx={{
        mr: 2,
        p: 2,
        borderRadius: '50%',
        bgcolor: theme.palette.mode === 'dark'
          ? 'rgba(122, 215, 204, 0.15)'
          : 'rgba(65, 179, 163, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box sx={{ fontSize: 28, color: theme.palette.primary.main }}>
        {icon}
      </Box>
    </Box>
    <Box>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 500,
          color: theme.palette.text.secondary,
          mb: 0.5
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: theme.palette.text.primary
        }}
      >
        <CountUp end={value} duration={2} separator="," />
      </Typography>
    </Box>
  </Paper>
);

// === Main Static Dashboard ===
const WelcomeDashboard = () => {
  const theme = useTheme();
  const SuperadminData = useUserData();
  const { orders, orderCounts, weeklyOrders } = useOrders();
  /* console.log("orders", orders, orderCounts, weeklyOrders); */

  const userCounts = useUserCounts();

  const adminCount = userCounts.find(c => c.user_Type_ID === 2)?.count || 0;
  const deliverymenCount = userCounts.find(c => c.user_Type_ID === 4)?.count || 0;
  const customerCount = userCounts.find(c => c.user_Type_ID === 5)?.count || 0;


  //console.log("deliveryman",deliverymen);

  // Chart options with theme colors
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: theme.palette.text.primary,
          font: {
            size: 12
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: theme.palette.text.secondary
        },
        grid: {
          color: theme.palette.divider
        }
      },
      y: {
        ticks: {
          color: theme.palette.text.secondary
        },
        grid: {
          color: theme.palette.divider
        }
      }
    }
  };

  // Update staticChartData with real data and theme colors
  const chartData = {
    line: {
      labels: [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }),
      datasets: [{
        label: 'Daily Orders',
        data: weeklyOrders,
        fill: true,
        backgroundColor: theme.palette.mode === 'dark'
          ? 'rgba(122, 215, 204, 0.1)'
          : 'rgba(65, 179, 163, 0.1)',
        borderColor: theme.palette.primary.main,
        tension: 0.4,
        pointBackgroundColor: theme.palette.primary.main,
        pointBorderColor: theme.palette.background.paper,
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }],
    },
    bar: {
      labels: ['Pending', 'Completed', 'Cancelled', 'Ready to Drop'],
      datasets: [{
        label: 'Order Status',
        data: [
          orderCounts.pending,
          orderCounts.completed,
          orderCounts.cancelled,
          orderCounts.readyToDrop
        ],
        backgroundColor: [
          theme.palette.warning.main,
          theme.palette.success.main,
          theme.palette.error.main,
          theme.palette.info.main,
        ],
        borderRadius: 8,
        borderWidth: 0,
      }],
    },
    stats: [
      { icon: 'dashboard', title: 'Total Orders', value: orders.length },
      { icon: 'cog', title: 'Completed Orders', value: orderCounts.totalCompleted },
      { icon: 'shopping', title: 'Admin', value: adminCount },
      { icon: 'box', title: 'Deliverymen', value: deliverymenCount },
      { icon: 'users', title: 'Customers', value: customerCount },

    ],
  };

  // Update the return statement to use chartData instead of staticChartData
  return (
    <Box sx={{
      flexGrow: 1,
      p: 4,
      bgcolor: theme.palette.background.default,
      minHeight: '100vh'
    }}>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 1
          }}
        >
          Welcome back, {SuperadminData?.user_Name || 'User'}! 👋
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary }}
        >
          Here's what's happening with your business today
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {chartData.stats.map((item, idx) => (
          <Grid item key={idx} xs={12} sm={6} md={4} lg={2.4}>
            <StatCard
              icon={
                item.icon === 'dashboard' ? <FaChartLine /> :
                  item.icon === 'shopping' ? <FaShoppingCart /> :
                    item.icon === 'box' ? <FaBox /> :
                      item.icon === 'users' ? <FaUsers /> :
                        <FaCog />
              }
              title={item.title}
              value={item.value}
              theme={theme}
            />
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              height: '100%'
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 3
              }}
            >
              Weekly Orders Trend
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line data={chartData.line} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              height: '100%'
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 3
              }}
            >
              Today's Order Status
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar data={chartData.bar} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WelcomeDashboard;
