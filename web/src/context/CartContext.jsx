// src/contexts/CartContext.js

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { cartService } from '../service/user/cartService';

const CartContext = createContext();

const initialState = {
  cartItems: [],
  loading: false,
  error: null,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case 'SET_CART_ITEMS':
      return {
        ...state,
        cartItems: action.payload,
        loading: false,
        error: null,
      };
    case 'ADD_TO_CART_SUCCESS':
      // Refresh cart items after successful add
      return {
        ...state,
        loading: false,
        error: null,
      };
    case 'REMOVE_FROM_CART_SUCCESS':
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.servSubType_Id !== action.payload.id),
        loading: false,
        error: null,
      };
    case 'UPDATE_QUANTITY_SUCCESS':
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.servSubType_Id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        loading: false,
        error: null,
      };
    case 'RESET_CART':
      return {
        ...state,
        cartItems: [],
        loading: false,
        error: null,
      };
    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart items on mount
  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await cartService.getCartItems();
      if (response.success) {
        dispatch({ type: 'SET_CART_ITEMS', payload: response.data });
      }
    } catch (error) {
      /* console.error('Error loading cart items:', error); */
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to load cart items' });
    }
  };

  const addToCart = async (item) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await cartService.addToCart(item);
      if (response.success) {
        dispatch({ type: 'ADD_TO_CART_SUCCESS' });
        // Reload cart items to get updated data
        await loadCartItems();
      }
    } catch (error) {
      /* console.error('Error adding to cart:', error); */
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to add item to cart' });
    }
  };

  const removeFromCart = async (servSubTypeId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await cartService.removeFromCart(servSubTypeId);
      if (response.success) {
        dispatch({ type: 'REMOVE_FROM_CART_SUCCESS', payload: { id: servSubTypeId } });
      }
    } catch (error) {
      /* console.error('Error removing from cart:', error); */
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to remove item from cart' });
    }
  };

  const increaseQuantity = async (servSubTypeId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await cartService.increaseQuantity(servSubTypeId);
      if (response.success) {
        // Reload cart items to get updated quantity
        await loadCartItems();
      }
    } catch (error) {
      /* console.error('Error increasing quantity:', error); */
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to increase quantity' });
    }
  };

  const decreaseQuantity = async (servSubTypeId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await cartService.decreaseQuantity(servSubTypeId);
      if (response.success) {
        // Reload cart items to get updated quantity
        await loadCartItems();
      }
    } catch (error) {
      /* console.error('Error decreasing quantity:', error); */
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to decrease quantity' });
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await cartService.clearCart();
      if (response.success) {
        dispatch({ type: 'RESET_CART' });
      }
    } catch (error) {
      /* console.error('Error clearing cart:', error); */
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to clear cart' });
    }
  };

  const contextValue = {
    cartItems: state.cartItems,
    loading: state.loading,
    error: state.error,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    refreshCart: loadCartItems,
    // Legacy dispatch for backward compatibility (if needed)
    dispatch: (action) => {
      switch (action.type) {
        case 'ADD_TO_CART':
          addToCart(action.payload);
          break;
        case 'REMOVE_FROM_CART':
          removeFromCart(action.payload.id);
          break;
        case 'INCREASE_QUANTITY':
          increaseQuantity(action.payload.id);
          break;
        case 'DECREASE_QUANTITY':
          decreaseQuantity(action.payload.id);
          break;
        case 'RESET_CART':
          clearCart();
          break;
        default:
          console.warn('Unknown action type:', action.type);
      }
    }
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
