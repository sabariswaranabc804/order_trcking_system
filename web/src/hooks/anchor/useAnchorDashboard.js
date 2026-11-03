import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  fetchUserInfo,
  fetchCustomers,
  fetchAssignedOrders,
  fetchAllOrders,
  fetchOrderDataByDate
} from '../../service/anchor/anchorDashboardService';
import {
  getLastSevenDays,
  formatChartLabels,
  filterOrdersByStatus,
  filterOrdersByStatusNames,
  createChartData,
  createChartOptions
} from '../../utils/anchorDashboardUtils';

const useAnchorDashboard = () => {
  const { user: userDetails } = useAuth();
  const navigate = useNavigate();
  
  // Extract user details
  const userID = userDetails?.user_code;
  const companyId = userDetails?.company_Id;
  const deliverymanId = userDetails?.deliveryman_id;
  
  // State variables
  const [user, setUser] = useState(null);
  const [customer, setCustomer] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [rows, setRows] = useState([]);
  const [orderData, setOrderData] = useState(Array(7).fill(0));
  
  /* console.log("orders",orderData); */
  
  // Get the last seven days
  const lastSevenDays = getLastSevenDays();
  
  // Fetch user information
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
        setCustomer(customerData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    getCustomers();
  }, []);
  
  // Fetch assigned orders
  useEffect(() => {
    const getAssignedOrders = async () => {
      if (deliverymanId) {
        try {
          const assignedOrders = await fetchAssignedOrders(deliverymanId);
          setRows(assignedOrders);
        } catch (err) {
          setError(err.message);
        }
      }
    };
    
    getAssignedOrders();
  }, [deliverymanId]);
  
  // Fetch all orders
  useEffect(() => {
    const getAllOrders = async () => {
      if (deliverymanId) {
        try {
          const allOrders = await fetchAllOrders(deliverymanId);
          setOrders(allOrders);
        } catch (err) {
          setError(err.message);
        }
      }
    };
    
    getAllOrders();
  }, [deliverymanId]);
  
  // Fetch order data for chart
  useEffect(() => {
    const getOrderData = async () => {
      if (deliverymanId) {
        try {
          const counts = await fetchOrderDataByDate(deliverymanId, lastSevenDays);
          setOrderData(counts);
        } catch (err) {
          setError(err.message);
        }
      }
    };
    
    getOrderData();
  }, [deliverymanId]);
  
  // Calculate order counts by status
  const countStatus2 = orders.length > 0 ? filterOrdersByStatus(orders, 2).length : 0;
  const countStatus5 = orders.length > 0 ? filterOrdersByStatus(orders, 6).length : 0;
  
  const validStatuses = ['Ready to Pick', 'Pick', 'Drop', 'Ready to Drop'];
  const countStatus3 = orders.length > 0 ? filterOrdersByStatusNames(orders, validStatuses).length : 0;
  
  // Create pie chart data
  const pieData = [
    { name: 'Picked Orders', value: countStatus2 },
    { name: 'Droped Orders', value: countStatus5 },
  ];
  
  // Create line chart data
  const chartLabels = formatChartLabels(lastSevenDays);
  const lineData = createChartData(chartLabels, orderData);
  const chartOptions = createChartOptions();
  
  return {
    user,
    customer,
    loading,
    error,
    orders,
    rows,
    countStatus2,
    countStatus3,
    countStatus5,
    pieData,
    lineData,
    chartOptions,
    COLORS: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'],
  };
};

export default useAnchorDashboard;