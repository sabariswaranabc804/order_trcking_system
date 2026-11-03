import { useCart } from '../../context/CartContext';

export const useCartHelpers = () => {
  const { cartItems, dispatch } = useCart();

  const handleIncreaseQuantity = (id) => {
    dispatch({ type: 'INCREASE_QUANTITY', payload: { id } });
  };

  const handleDecreaseQuantity = (id) => {
    dispatch({ type: 'DECREASE_QUANTITY', payload: { id } });
  };

  const handleRemoveFromCart = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id } });
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.rate) || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const calculateTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cartItems,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleRemoveFromCart,
    calculateTotalPrice,
    calculateTotalQuantity
  };
};
