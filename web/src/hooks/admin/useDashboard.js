import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  fetchUserInfo,
  fetchCustomers,
  fetchDeliverymen,
  fetchOrders,
  fetchOrderData,
  getLastSevenDays
} from '../../service/admin/dashboardService';

const useDashboard = () => {
  // Get user details from auth context
  const { user: userDetails } = useAuth();
  const userID = userDetails?.user_code;
  const companyId = userDetails?.company_Id;

  // State variables
  const [user, setUser] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [deliverymen, setDeliverymen] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderData, setOrderData] = useState(Array(7).fill(0));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  /* console.log("deliveryman",deliverymen); */
  
  // Fetch user info
  useEffect(() => {
    const getUserInfo = async () => {
      if (userID) {
        try {
          const userData = await fetchUserInfo(userID);
          setUser(userData);
        } catch (err) {
          setError(err.message);
        }
      }
    };
    getUserInfo();
  }, [userID]);

  // Fetch customers
  useEffect(() => {
    const getCustomers = async () => {
      try {
        const customerData = await fetchCustomers();
        setCustomers(customerData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getCustomers();
  }, []);

  // Fetch deliverymen
  useEffect(() => {
    const getDeliverymen = async () => {
      try {
        const deliverymenData = await fetchDeliverymen(0);
        setDeliverymen(deliverymenData);
      } catch (err) {
        setError(err.message);
      }
    };
    getDeliverymen();
  }, [companyId]);

  // Fetch orders
  useEffect(() => {
    const getOrders = async () => {
      try {
        const orderData = await fetchOrders();
        setOrders(orderData);
      } catch (err) {
        setError(err.message);
      }
    };
    getOrders();
  }, []);

  // Fetch order data for chart
  useEffect(() => {
    const getOrderData = async () => {
      const data = await fetchOrderData();
      setOrderData(data);
    };
    getOrderData();
  }, []);

  // Process order data for display
  const processOrderData = () => {
    // Default values to prevent undefined errors
    const defaultData = {
      countStatus2: 0,
      countStatus3: 0,
      countStatus5: 0,
      data: [],
      dataLine: {
        labels: [],
        datasets: []
      },
      options: {
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
      }
    };

    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      return defaultData;
    }

    try {
      // Filter orders with statusName == 'Pending'
      const ordersWithStatus2 = orders.filter(order => order.status_Name === 'PENDING');
      const countStatus2 = ordersWithStatus2.length;

      // Filter orders with statusName == 'Completed'
      const ordersWithStatus5 = orders.filter(order => order.status_Name === 'DELIVERED');
      const countStatus5 = ordersWithStatus5.length;

      // Filter orders with statusName in progress statuses
      const validStatuses = ['IN_PROCESSING'];
      const ordersWithStatus3 = orders.filter(order =>
        validStatuses.includes(order.status_Name)
      );
      const countStatus3 = ordersWithStatus3.length;

      // Prepare pie chart data
      const data = [
        { name: 'Pending', value: countStatus2 },
        { name: 'Progress', value: countStatus3 },
        { name: 'Delivered', value: countStatus5 },
      ];

      // Ensure orderData is an array
      const safeOrderData = Array.isArray(orderData) ? orderData : Array(7).fill(0);

      // Prepare line chart data
      const dataLine = {
        labels: getLastSevenDays().map(date => {
          const [year, month, day] = date.split('-');
          return `${day} ${new Date(year, month - 1).toLocaleString('en', { month: 'short' })}`;
        }),
        datasets: [
          {
            label: 'Orders',
            data: safeOrderData,
            fill: false,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            tension: 0.1,
          },
        ],
      };

      // Chart options
      const options = {
        responsive: true,
        maintainAspectRatio: false,
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

      return { countStatus2, countStatus3, countStatus5, data, dataLine, options };
    } catch (error) {
      /* console.error('Error processing order data:', error); */
      return defaultData;
    }
  };

  const { countStatus2, countStatus3, countStatus5, data, dataLine, options } = processOrderData();
 
  /* console.log("data",data); */
  
  return {
    user,
    customers,
    deliverymen,
    loading,
    error,
    countStatus2,
    countStatus3,
    countStatus5,
    data,
    dataLine,
    options,
    COLORS: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
  };
};

export default useDashboard;