import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { 
  fetchUserOrders, 
  fetchOrderDetails, 
  cancelOrder, 
  setOrderCompleted 
} from "../../service/user/ordersService";

export const useOrderDetails = ({ orderId, userId, navigate }) => {
  const [orderData, setOrderData] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (userId) {
      fetchUserOrders(userId)
        .then(setOrders)
        .catch(() => {
          /* Optional error handling */
        });
    }
  }, [userId]);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId)
        .then(({ order, products }) => {
          setOrderData(order);
          setProducts(products);
        })
        .catch(() => {
          /* Optional error handling */
        });
    }
  }, [orderId]);

  const handleCancelOrder = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it'
    });

    if (result.isConfirmed) {
      try {
        await cancelOrder(orderId);
        Swal.fire('Cancelled!', 'Your order has been canceled.', 'success');
        navigate(-1);
      } catch (error) {
        Swal.fire('Error!', 'Failed to cancel the order. Please try again.', 'error');
      }
    }
  };

  const handleSetCompleted = async () => {
    try {
      const response = await setOrderCompleted(orderId);
      toast.success(response.data.message);
      navigate(-1);
    } catch (error) {
      /* Optional error handling */
    }
  };

  return {
    orderData,
    products,
    orders,
    handleCancelOrder,
    handleSetCompleted
  };
};
