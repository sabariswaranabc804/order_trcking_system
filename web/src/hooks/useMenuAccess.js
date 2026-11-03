import { useState, useEffect } from 'react';  // Add useEffect
import axios from 'axios';
import API_URL from '../config';

export const useMenuAccess = () => {
  const [menuAccessData, setMenuAccessData] = useState([
    { id: 1, title: 'Dashboard', menu: 'Master', submenu: 'Main', list: 'Dashboard Access', admin: true, owner: true, anchor: false, customer: false },
    { id: 2, title: 'Laundry Reception', menu: 'Master', submenu: 'Operations', list: 'Reception Management', admin: true, owner: true, anchor: false, customer: false },
    { id: 3, title: 'Orders', menu: 'Transaction', submenu: 'Order', list: 'Order Management', admin: true, owner: true, anchor: true, customer: true },
    { id: 4, title: 'Services', menu: 'Master', submenu: 'Service', list: 'Service Management', admin: true, owner: false, anchor: false, customer: false },
    { id: 5, title: 'Products', menu: 'Master', submenu: 'Product', list: 'Product Management', admin: true, owner: true, anchor: false, customer: false },
  ]);
    
  const [menuData, setMenuData] = useState([]);

  // Add useEffect to fetch data on hook initialization
  useEffect(() => {
    fetchMenuAccess();
  }, []); // Empty dependency array means this runs once when component mounts

  const fetchMenuAccess = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v2/superadmin/menu-access`);
      setMenuData(response.data.data);
    } catch (error) {
      /* console.error('Error fetching menu access:', error); */
    }
  };
  const updateMenuAccess = async () => {
    try {
      // Replace with your actual API endpoint
      await axios.put(`${API_URL}/api/v2/superadmin/menu-access`, menuAccessData);
      return true;
    } catch (error) {
      /* console.error('Error updating menu access:', error); */
      return false;
    }
  };

  return {
    menuData,
    menuAccessData,
    fetchMenuAccess,
    setMenuAccessData,
    updateMenuAccess
  };
};