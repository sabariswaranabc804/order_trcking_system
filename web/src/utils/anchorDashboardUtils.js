// Function to get the last seven days in 'YYYY-MM-DD' format
export const getLastSevenDays = () => {
  const dates = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split('T')[0]); // Format as 'YYYY-MM-DD'
  }
  return dates;
};

// Function to format dates for chart labels
export const formatChartLabels = (dates) => {
  return dates.map(date => {
    const [year, month, day] = date.split('-');
    return `${day} ${new Date(year, month - 1).toLocaleString('en', { month: 'short' })}`;
  });
};

// Function to filter orders by status
export const filterOrdersByStatus = (orders, statusId) => {
  return orders.filter(order => order.orderStatus_Id == statusId);
};

// Function to filter orders by status names
export const filterOrdersByStatusNames = (orders, statusNames) => {
  return orders.filter(order => statusNames.includes(order.status_Name));
};

// Function to create chart data
export const createChartData = (labels, orderData) => {
  return {
    labels,
    datasets: [
      {
        label: 'Literature Survey',
        data: orderData,
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };
};

// Function to create chart options
export const createChartOptions = () => {
  return {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Order Count',
        },
        ticks: {
          stepSize: 5,
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
  };
};