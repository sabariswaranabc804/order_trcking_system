import React from "react";
import { Grid } from "@mui/material";
import useLaundryReception from "../../../hooks/admin/useLaundryReception";
import UserSelection from "../../../components/admin/Orders/UserSelection";
import ServiceTypeSelection from "../../../components/admin/Orders/ServiceTypeSelection";
import ServiceItems from "../../../components/admin/Orders/ServiceItems";
import AddressSelection from "../../../components/admin/Orders/AddressSelection";
import OrderSummary from "../../../components/admin/Orders/OrderSummary";

const LaundryReception = () => {
  const {
    // State
    selectedUser,
    selectedUserId,
    selectedItems,
    totalPrice,
    qrData,
    paymentStatus,
    serviceType,
    orderServiceType,
    userError,
    userAddresses,
    selectedAddress,
    selectedAddressId,
    
    // Data
    users,
    serviceItems,
    
    // Refs
    userRef,
    
    // Handlers
    handleUserChange,
    handleServiceChange,
    handleItemClick,
    handleQuantityChange,
    handleDeleteItem,
    handleOrderSubmit,
    generateQRCode,
    cancelQRCode,
    setPaymentStatus,
    setOrderServiceType,
    handleAddressChange
  } = useLaundryReception();

  return (
    <Grid container spacing={2} padding={3}>
      <UserSelection 
        users={users}
        selectedUser={selectedUser}
        handleUserChange={handleUserChange}
        userRef={userRef}
        userError={userError}
      />
      
      <ServiceTypeSelection 
        serviceType={serviceType}
        serviceItems={serviceItems}
        handleServiceChange={handleServiceChange}
      />
      
      <ServiceItems 
        serviceType={serviceType}
        serviceItems={serviceItems}
        handleItemClick={handleItemClick}
      />
      
      <AddressSelection
        userAddresses={userAddresses}
        selectedAddress={selectedAddress}
        handleAddressChange={handleAddressChange}
        orderServiceType={orderServiceType}
        selectedUserId={selectedUserId}
      />
      
      <OrderSummary 
        selectedItems={selectedItems}
        totalPrice={totalPrice}
        paymentStatus={paymentStatus}
        qrData={qrData}
        orderServiceType={orderServiceType}
        setPaymentStatus={setPaymentStatus}
        setOrderServiceType={setOrderServiceType}
        generateQRCode={generateQRCode}
        cancelQRCode={cancelQRCode}
        handleOrderSubmit={handleOrderSubmit}
        handleQuantityChange={handleQuantityChange}
        handleDeleteItem={handleDeleteItem}
      />
    </Grid>
  );
};

export default LaundryReception;