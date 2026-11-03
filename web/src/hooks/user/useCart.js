import { useCart as useCartContext } from '../../context/CartContext';
import { useState, useEffect } from 'react';

export const useCart = () => {
  const {
    cartItems,
    loading,
    error,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    refreshCart
  } = useCartContext();

  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  // Calculate cart count and total whenever cartItems change
  useEffect(() => {
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    const total = cartItems.reduce((total, item) => total + (item.service_price * item.quantity), 0);
    
    setCartCount(count);
    setCartTotal(total);
  }, [cartItems]);

  // Helper function to check if item is in cart
  const isInCart = (servSubTypeId) => {
    return cartItems.some(item => item.servSubType_Id === servSubTypeId);
  };

  // Helper function to get item quantity
  const getItemQuantity = (servSubTypeId) => {
    const item = cartItems.find(item => item.servSubType_Id === servSubTypeId);
    return item ? item.quantity : 0;
  };

  // Helper function to get item from cart
  const getCartItem = (servSubTypeId) => {
    return cartItems.find(item => item.servSubType_Id === servSubTypeId);
  };

  return {
    // State
    cartItems,
    loading,
    error,
    cartCount,
    cartTotal,
    
    // Actions
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    refreshCart,
    
    // Helper functions
    isInCart,
    getItemQuantity,
    getCartItem
  };
};