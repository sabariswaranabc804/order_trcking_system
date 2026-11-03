import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [orderCounts, setOrderCounts] = useState({
    pending: 0,
    completed: 0,
    readyToDrop: 0,
    cancelled: 0,
    totalCompleted: 0,
  });
  const [weeklyOrders, setWeeklyOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/admin/all-order-details`);
        const ordersData = response.data.data;
        setOrders(ordersData);

        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        
        // Filter orders for today only
        const todayOrders = ordersData.filter(order => 
          order.order_date.startsWith(today)
        );

        // Calculate today's status counts
        const pending = todayOrders.filter(order => order.status_Name === 'PENDING').length;
        const completed = todayOrders.filter(order => order.status_Name === 'DELIVERED').length;
        const readyToDrop = todayOrders.filter(order => order.status_Name === 'READY_FOR_DELIVERY').length;
        const cancelled = todayOrders.filter(order => order.status_Name === 'REJECTED').length;
        const totalCompleted = ordersData.filter(order => order.status_Name === 'DELIVERED').length;
        setOrderCounts({ pending, completed, readyToDrop, cancelled,totalCompleted });

        // Calculate last 7 days orders
        const last7Days = [...Array(7)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.toISOString().split('T')[0];
        }).reverse();

        const dailyCounts = last7Days.map(date => 
          ordersData.filter(order => order.order_date.startsWith(date)).length
        );

        setWeeklyOrders(dailyCounts);
      } catch (error) {
        /* console.error('Error fetching orders:', error); */
      }
    };

    fetchOrders();
  }, []);

  return { orders, orderCounts, weeklyOrders };
};