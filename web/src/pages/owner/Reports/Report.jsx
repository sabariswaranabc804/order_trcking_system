import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Box,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { getRevenueData, getMonthlyRevenueData, getServiceUsageData } from '../../../service/reportsService';

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const ReportsAnalytics = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState(null);
  const [serviceUsageData, setServiceUsageData] = useState(null);

  const handleTabChange = (_, newValue) => setTabIndex(newValue);

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [revenueResponse, monthlyRevenueResponse, serviceResponse] = await Promise.all([
        getRevenueData(),
        getMonthlyRevenueData(),
        getServiceUsageData()
      ]);

      // Process revenue data for charts
      const processedRevenueData = processRevenueData(revenueResponse);
      const processedMonthlyRevenueData = processMonthlyRevenueData(monthlyRevenueResponse);
      const processedServiceData = processServiceUsageData(serviceResponse);

      setRevenueData(processedRevenueData);
      setMonthlyRevenueData(processedMonthlyRevenueData);
      setServiceUsageData(processedServiceData);
    } catch (err) {
      /* console.error('Error fetching reports data:', err); */
      setError('Failed to load reports data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const processRevenueData = (data) => {
    if (!data || data.length === 0) {
      return {
        daily: {
          labels: [],
          datasets: [{
            label: 'Daily Revenue',
            data: [],
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
            fill: true,
          }]
        },
        orders: {
          labels: [],
          datasets: [{
            label: 'Daily Orders',
            data: [],
            backgroundColor: 'rgba(63,81,181,0.6)',
          }]
        }
      };
    }

    const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));
    const labels = sortedData.map(item => new Date(item.date).toLocaleDateString());
    const revenues = sortedData.map(item => parseFloat(item.revenue) || 0);
    const orders = sortedData.map(item => parseInt(item.orderCount) || 0);

    return {
      daily: {
        labels,
        datasets: [{
          label: 'Daily Revenue (₹)',
          data: revenues,
          borderColor: 'rgba(75,192,192,1)',
          backgroundColor: 'rgba(75,192,192,0.2)',
          fill: true,
        }]
      },
      orders: {
        labels,
        datasets: [{
          label: 'Daily Orders',
          data: orders,
          backgroundColor: 'rgba(63,81,181,0.6)',
        }]
      }
    };
  };

  const processMonthlyRevenueData = (data) => {
    if (!data || data.length === 0) {
      return {
        revenue: {
          labels: [],
          datasets: [{
            label: 'Monthly Revenue',
            data: [],
            borderColor: 'rgba(255,99,132,1)',
            backgroundColor: 'rgba(255,99,132,0.2)',
            fill: true,
          }]
        },
        orders: {
          labels: [],
          datasets: [{
            label: 'Monthly Orders',
            data: [],
            backgroundColor: 'rgba(54,162,235,0.6)',
          }]
        }
      };
    }

    const sortedData = data.sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });
    
    const labels = sortedData.map(item => item.monthYear);
    const revenues = sortedData.map(item => parseFloat(item.revenue) || 0);
    const orders = sortedData.map(item => parseInt(item.orderCount) || 0);

    return {
      revenue: {
        labels,
        datasets: [{
          label: 'Monthly Revenue (₹)',
          data: revenues,
          borderColor: 'rgba(255,99,132,1)',
          backgroundColor: 'rgba(255,99,132,0.2)',
          fill: true,
        }]
      },
      orders: {
        labels,
        datasets: [{
          label: 'Monthly Orders',
          data: orders,
          backgroundColor: 'rgba(54,162,235,0.6)',
        }]
      }
    };
  };

  const processServiceUsageData = (data) => {
    if (!data || data.length === 0) {
      return {
        labels: [],
        datasets: [{
          label: 'Service Usage',
          data: [],
          backgroundColor: [],
        }]
      };
    }

    const colors = ['#2196f3', '#4caf50', '#ff9800', '#f44336', '#9c27b0', '#00bcd4', '#795548', '#607d8b'];
    const labels = data.map(item => item.serviceName);
    const usageCounts = data.map(item => parseInt(item.usageCount) || 0);
    const backgroundColors = data.map((_, index) => colors[index % colors.length]);

    return {
      labels,
      datasets: [{
        label: 'Service Usage Count',
        data: usageCounts,
        backgroundColor: backgroundColors,
      }]
    };
  };



  if (loading) {
    return (
      <Card sx={{ m: 3, p: 2 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>Loading reports...</Typography>
        </Box>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ m: 3, p: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Box display="flex" justifyContent="center">
          <button
            onClick={fetchReportsData}
            style={{
              padding: '10px 20px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </Box>
      </Card>
    );
  }

  return (
    <Card sx={{ m: 3, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        📊 Reports & Analytics
      </Typography>

      <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Order & Revenue" />
        <Tab label="Service Usage" />
      </Tabs>

      <Box>
        {tabIndex === 0 && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '500px' }}>
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Daily Revenue Trend</Typography>
                  {revenueData?.daily ? (
                    <Box sx={{ flexGrow: 1, height: '400px', position: 'relative' }}>
                      <Line
                        data={revenueData.daily}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'top',
                            },
                            tooltip: {
                              callbacks: {
                                label: function (context) {
                                  return `Revenue: ₹${context.parsed.y.toLocaleString()}`;
                                }
                              }
                            }
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: {
                                callback: function (value) {
                                  return '₹' + value.toLocaleString();
                                }
                              }
                            }
                          }
                        }}
                      />
                    </Box>
                  ) : (
                    <Box sx={{
                      flexGrow: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Typography color="text.secondary">No revenue data available</Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '500px' }}>
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Daily Orders Count</Typography>
                  {revenueData?.orders ? (
                    <Box sx={{ flexGrow: 1, height: '400px', position: 'relative' }}>
                      <Bar
                        data={revenueData.orders}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'top',
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                            }
                          }
                        }}
                      />
                    </Box>
                  ) : (
                    <Box sx={{
                      flexGrow: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Typography color="text.secondary">No order data available</Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '500px' }}>
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Monthly Revenue Trend</Typography>
                  {monthlyRevenueData?.revenue ? (
                    <Box sx={{ flexGrow: 1, height: '400px', position: 'relative' }}>
                      <Line
                        data={monthlyRevenueData.revenue}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'top',
                            },
                            tooltip: {
                              callbacks: {
                                label: function (context) {
                                  return `Revenue: ₹${context.parsed.y.toLocaleString()}`;
                                }
                              }
                            }
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: {
                                callback: function (value) {
                                  return '₹' + value.toLocaleString();
                                }
                              }
                            }
                          }
                        }}
                      />
                    </Box>
                  ) : (
                    <Box sx={{
                      flexGrow: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Typography color="text.secondary">No monthly revenue data available</Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '500px' }}>
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Monthly Orders Count</Typography>
                  {monthlyRevenueData?.orders ? (
                    <Box sx={{ flexGrow: 1, height: '400px', position: 'relative' }}>
                      <Bar
                        data={monthlyRevenueData.orders}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'top',
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                            }
                          }
                        }}
                      />
                    </Box>
                  ) : (
                    <Box sx={{
                      flexGrow: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Typography color="text.secondary">No monthly order data available</Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {tabIndex === 1 && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Most / Least Used Services</Typography>
              {serviceUsageData ? (
                <Box sx={{
                  height: '400px',
                  width: '100%',
                  position: 'relative'
                }}>
                  <Bar
                    data={serviceUsageData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                          labels: {
                            boxWidth: 12,
                            padding: 15
                          }
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              return `${context.label}: ${context.parsed.y} orders`;
                            }
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Number of Orders'
                          },
                          grid: {
                            color: 'rgba(0,0,0,0.1)'
                          }
                        },
                        x: {
                          title: {
                            display: true,
                            text: 'Services'
                          },
                          ticks: {
                            maxRotation: 45,
                            minRotation: 0
                          },
                          grid: {
                            display: false
                          }
                        }
                      }
                    }}
                  />
                </Box>
              ) : (
                <Box sx={{
                  height: '400px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Typography color="text.secondary">No service usage data available</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        )}
      </Box>
    </Card>
  );
};

export default ReportsAnalytics;
