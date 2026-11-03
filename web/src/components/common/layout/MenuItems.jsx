import React, { useEffect } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import InventoryIcon from '@mui/icons-material/Inventory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AssessmentIcon from '@mui/icons-material/Assessment';
import FeedbackIcon from '@mui/icons-material/Feedback';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import GroupIcon from '@mui/icons-material/Group';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import CategoryIcon from '@mui/icons-material/Category';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import HistoryIcon from '@mui/icons-material/History';



import { useSelector } from 'react-redux';
import { useMenuAccess } from '../../../hooks/useMenuAccess';
import { useAuth } from '../../../context/AuthContext';




export const getMenuItems = () => {
  const { user } = useAuth();

  const userType = user?.userType;
  const { menuData } = useMenuAccess();

  //console.log("menuData", menuData);

  useEffect(() => {
    if (menuData && menuData.length > 0) {
     // console.log("Menu Data loaded:", menuData);
    }
  }, [menuData]);

  if (userType == 1) {
    return [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/superadmin' },
      { text: 'Admin Management', icon: <AdminPanelSettingsIcon />, path: '/superadmin/adminmanagement' },
      { text: 'Service Management', icon: <LocalLaundryServiceIcon />, path: '/superadmin/service' },
      { text: 'Product Management', icon: <InventoryIcon />, path: '/superadmin/product' },
      { text: 'Revenue', icon: <AttachMoneyIcon />, path: '/superadmin/revenue' },
      { text: 'Order Monitoring', icon: <VisibilityIcon />, path: '/admin/orderpage' },
      //  { text: 'Deliveryman Oversight', icon: <DeliveryDiningIcon />, path: '/admin/anchor' },
      { text: 'Reports & Analytics', icon: <AssessmentIcon />, path: '/superadmin/report' },
      { text: 'Customer Feedback', icon: <FeedbackIcon />, path: '/superadmin/customer' },
      { text: 'Communication & Support', icon: <SupportAgentIcon />, path: '/superadmin/communication' },

      { text: 'Chat-Box', icon: <ChatIcon />, path: '/superadmin/chatbox' },
      { text: 'Settings & Configuration', icon: <SettingsIcon />, path: '/superadmin/setting' },
      { text: 'Profile', icon: <PersonIcon />, path: '/superadmin/profilepage' }
    ];
  }
  else if (userType == 3) {
    return [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/superadmin' },
      { text: 'Admin Management', icon: <AdminPanelSettingsIcon />, path: '/superadmin/adminmanagement' },
      { text: 'Service Management', icon: <LocalLaundryServiceIcon />, path: '/superadmin/service' },
      { text: 'Product Management', icon: <InventoryIcon />, path: '/superadmin/product' },
      { text: 'Order Monitoring', icon: <VisibilityIcon />, path: '/admin/orderpage' },
      { text: 'Admin Reception', icon: <ReceiptIcon />, path: '/superadmin/laundryReception' },
      { text: 'Reports & Analytics', icon: <AssessmentIcon />, path: '/superadmin/report' },
      { text: 'Customer Overview', icon: <GroupIcon />, path: '/superadmin/customer' },
      { text: 'Communication & Support', icon: <SupportAgentIcon />, path: '/superadmin/communication' },
      { text: 'Settings & Configuration', icon: <SettingsIcon />, path: '/superadmin/setting' },
      { text: 'Chat-Box', icon: <ChatIcon />, path: '/superadmin/chatbox' },
      { text: 'Profile', icon: <PersonIcon />, path: '/superadmin/profilepage' }
    ]
  }
  else if (userType == 2) {
    const allowedMenuItems = [];

    if (menuData?.some(item => item.title === "Dashboard" && item.admin === true)) {
      allowedMenuItems.push({ text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' });
    }
    if (menuData?.some(item => item.title === "Laundry Reception" && item.admin === true)) {
      allowedMenuItems.push({ text: 'LaundryReception', icon: <ReceiptIcon />, path: '/admin/laundryReception' });
    }
    if (menuData?.some(item => item.title === "Orders" && item.admin === true)) {
      allowedMenuItems.push({ text: 'Orders', icon: <ShoppingCartIcon />, path: '/admin/orderpage' });
    }
     if (menuData?.some(item => item.title === "Two Way" && item.admin === true)) {
      allowedMenuItems.push({ text: 'Self-service-Orders', icon: <ShoppingCartIcon />, path: '/admin/walk-way' });
    }
    if (menuData?.some(item => item.title === "One Way" && item.admin === true)) {
      allowedMenuItems.push({ text: 'One-Way-Orders', icon: <ShoppingCartIcon />, path: '/admin/one-way' });
    }
    if (menuData?.some(item => item.title === "Two Way" && item.admin === true)) {
      allowedMenuItems.push({ text: 'Two-Way-Orders', icon: <ShoppingCartIcon />, path: '/admin/two-way' });
    }
   
    if (menuData?.some(item => item.title === "Customer" && item.admin === true)) {
      allowedMenuItems.push({ text: 'Customers', icon: <GroupIcon />, path: '/admin/customers' });
    }
    if (menuData?.some(item => item.title === "Anchor" && item.admin === true)) {
      allowedMenuItems.push({ text: 'Anchor', icon: <DeliveryDiningIcon />, path: '/admin/anchor' });
    }
    if (menuData?.some(item => item.title === "Services" && item.admin === true)) {
      allowedMenuItems.push({ text: 'Service', icon: <MiscellaneousServicesIcon />, path: '/admin/service' });
    }
    if (menuData?.some(item => item.title === "Products" && item.admin === true)) {
      allowedMenuItems.push({ text: 'Product', icon: <CategoryIcon />, path: '/admin/product' });
    }
    if (menuData?.some(item => item.title === "Profile Page" && item.admin === true)) {
      allowedMenuItems.push({ text: 'Profile', icon: <PersonIcon />, path: '/admin/profilepage' });
    }

    allowedMenuItems.push({ text: 'chatbox', icon: <ChatIcon />, path: '/admin/chatbox' });
//    allowedMenuItems.push({ text: 'Self-service-Orders', icon: <ChatIcon />, path: '/admin/walk-way' });

    return allowedMenuItems;
  } else if (userType == 4) {
    return [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/anchor' },
      { text: 'Assign orders', icon: <AssignmentIcon />, path: '/anchor/anchorTakeorder' },
      { text: 'Pending Orders', icon: <PendingActionsIcon />, path: '/anchor/pendingorder' },
      { text: 'History Order', icon: <HistoryIcon />, path: '/anchor/myorder' },
      // { text: 'DeliveryOrder', icon: <DeliveryDiningIcon />, path: '/anchor/anchorAssignDeliveryOrders' },
      //    { text: 'mydeliveryOrders', icon: <DeliveryDiningIcon />, path: '/anchor/mydeliveryOrders' },
      { text: 'Chat-Box', icon: <ChatIcon />, path: '/anchor/chatbox' },
      { text: 'profilepage', icon: <PersonIcon />, path: '/anchor/profilepage' },
      //  { text: 'Two-Way-Orders', icon: <ShoppingCartIcon />, path: '/admin/two-way' }
    ];
  }
  return []; // Return empty array if no user type matches
};
