import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout and Common Pages
import Layout from '../pages/LayOut';
import WelcomeDashboard from '../pages/owner/dashboard/WelcomeDashboard';
import NotFound from '../pages/common/NotFoundPage';
import Unauthorized from '../pages/common/UnAuth';
import NotificationPage from "../pages/common/NotificationPage";

// User Components
import UserHome from '../pages/user/Home/UserHome';
import UserCart from '../pages/user/Home/UserCart';
import DeliveryAddress from '../pages/user/Address/DeliveryAddress';
import AddNewAddress from '../pages/user/Address/AddNewAddress';
import OrderSummaryPage from '../pages/user/order/OrderSummaryPage';
import Wishlist from '../pages/user/profile/Wishlist';
import UserProfile from '../pages/user/profile/Userprofilepage';
import ProductDetailsPage from '../pages/user/order/ProductDetailsPage';
import EditAddress from '../pages/user/Address/EditAddress';
import UserAddress from '../pages/user/Address/UserAddress';
import FeedbackPage from '../pages/user/Query/FeedbackPage';

// Admin Components
import AdminDashBoard from '../pages/admin/Dashboard/Dashboard';
import AdminOrder from '../pages/admin/Orders/OrderList';
import AdminCustomers from '../pages/admin/Anchor/Customers';
import AdminAnchor from '../pages/admin/Anchor/Anchor';
import AdminServices from '../pages/admin/Service/Services';
import AdminOrderList from '../pages/admin/Orders/OrderList';

import AdminProfilePage from '../pages/admin/Profile/AdminProfilePage';
import AdminProduct from '../pages/admin/Service/Product';
import AdminCategory from '../components/admin/Category';
import LaundryReception from "../pages/admin/Orders/LaundryReception";
import ServicesPage from '../pages/admin/Orders/OrderPage';
import OrderList from '../pages/admin/Orders/OrderList2';

// Super Admin Components
import AdminManagement from '../pages/owner/userManagement/AdminManagement';  
import ReportsAnalytics from '../pages/owner/Reports/Report';
import CustomerOverview from '../pages/owner/Query/Customer';
import CommunicationSupport from '../pages/owner/Query/Communication';
import SettingsConfiguration from '../pages/owner/setting/Setting';
// import SuperAdminPage from '../pages/';
import Revenue from '../pages/owner/Reports/Revenue';
import ChatBox from '../pages/owner/Query/ChatBox';
import DeliverymanChat from '../pages/owner/Query/DeliverymanChat';

// Anchor Components
import AnchorTakeOrderAnchor from '../pages/anchor/order/TakeorderAnchor';
import AnchorDashboard from '../pages/anchor/Dashboard/AnchorDashboard';
import AnchorPickUpOrder from '../pages/anchor/order/PickUpOrder';
import AnchorProfilePage from '../pages/anchor/profile/AnchorProfilePage';
import AuthPage from '../pages/AuthPage';
import MyOrder from '../pages/anchor/order/MyOrder';
import SelfService from '../pages/admin/Orders/SelfService';
// import MyDeliveryOrders from '../pages/anchor/order/MyDeliveryOrders';
// import AdminAssignDeliveryOrders from '../pages/anchor/order/AdminAssignDeliveryOrders';


// Initial Redirect Component
const InitialRedirect = () => {
  const userType = localStorage.getItem('user_type');
  
  switch(userType) {
    case '1':
      return <Navigate to="/superadmin" />;
    case '2':
      return <Navigate to="/admin" />;
    case '4':
      return <Navigate to="/anchor" />;
    case '5':
      return <Navigate to="/user" />;
    default:
      return <UserHome />;
  }
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<InitialRedirect />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/401" element={<Unauthorized />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<Layout />}>
        <Route index element={<AdminDashBoard />} />
        <Route path="one-way" element={<AdminOrder />}/>
        <Route path="two-way" element={<OrderList />}/>
          <Route path="walk-way" element={<SelfService />}/>
        <Route path="laundryReception" element={<LaundryReception />}/>
        <Route path="customers" element={<AdminCustomers />}/>
        <Route path="anchor" element={<AdminAnchor />}/>
        <Route path="service" element={<AdminServices />}/>
        <Route path="orderlist" element={<AdminOrderList />}/>
        {/* <Route path="orderdetails" element={<AdminOrderDetails />}/> */}
        <Route path="profilepage" element={<AdminProfilePage />}/>
        <Route path="product" element={<AdminProduct />}/>
        <Route path="category" element={<AdminCategory />}/>
        <Route path="orderpage" element={<ServicesPage />}/>
        <Route path="chatbox" element={<DeliverymanChat />} />
        <Route path="AdminNotifications" element={<NotificationPage />}/>
      </Route>

      {/* Super Admin Routes */}
      <Route path="/superadmin" element={<Layout />}>
        <Route index element={<WelcomeDashboard />} />
        <Route path="adminmanagement" element={<AdminManagement />} />
        <Route path="service" element={<AdminServices />}/>
        <Route path="product" element={<AdminProduct />}/>
        <Route path="revenue" element={<Revenue />} />
        {/* <Route path="superadminpage" element={<SuperAdminPage />} /> */}
        <Route path="deliveryman" element={<>hi</>} />
        <Route path="report" element={<ReportsAnalytics />} />
        <Route path="customer" element={<CustomerOverview />} />
        <Route path="profilepage" element={<AdminProfilePage />}/>
        <Route path="communication" element={<CommunicationSupport />} />
        <Route path="setting" element={<SettingsConfiguration />} />
        <Route path="laundryReception" element={<LaundryReception />}/>
        <Route path="chatbox2" element={<ChatBox />}/>
        <Route path="chatbox" element={<DeliverymanChat />} />
      </Route>

      {/* Anchor Routes */}
      <Route path="/anchor" element={<Layout />}>
        <Route index element={<AnchorDashboard />} />
        <Route path="anchorTakeorder" element={<AnchorTakeOrderAnchor />} />
        <Route path="pendingorder" element={<AnchorPickUpOrder />} />
        <Route path="chatbox" element={<DeliverymanChat />} />
        <Route path="profilepage" element={<AnchorProfilePage />} />
        <Route path="myorder" element={<MyOrder />} />
        <Route path="AnchorNotifications" element={<NotificationPage />}/>
        {/* <Route path="anchorAssignDeliveryOrders" element={<AdminAssignDeliveryOrders />} />
        <Route path='mydeliveryOrders' element={<MyDeliveryOrders />} /> */}
      </Route>

      {/* User Routes */}
      <Route path="/user" element={<UserHome />} />
      <Route path="/useraddress" element={<UserAddress />} />
      <Route path="/cart" element={<UserCart />} />
      <Route path="/delivery" element={<DeliveryAddress />} /> 
      <Route path="/addaddress" element={<AddNewAddress />} />
      <Route path="/editaddress" element={<EditAddress />} />
      <Route path="/history" element={<OrderSummaryPage />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/UserNotifications" element={<NotificationPage />} />
      <Route path="/account" element={<UserProfile />} />
      <Route path="/product-details" element={<ProductDetailsPage />} />
      <Route path="/cart-category" element={<UserCart />} />
      <Route path="/feedback" element={<FeedbackPage/>}/>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;