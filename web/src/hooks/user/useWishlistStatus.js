import { useState, useEffect } from "react";
import wishlistService from "../../service/user/wishlistService";

export const useWishlistStatus = (customerId, serviceId) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    if (!customerId) return;
    try {
      setLoading(true);
      const data = await wishlistService.getWishlist(customerId);
      setWishlistItems(data);
    } catch (error) {
      /* console.error("Error fetching wishlist:", error); */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  const isInWishlist = wishlistItems.some((item) => item.servSubType_Id === serviceId);

  const addToWishlist = async () => {
    await wishlistService.addToWishlist(customerId, serviceId);
    fetchWishlist();
  };

  const removeFromWishlist = async () => {
    await wishlistService.removeFromWishlist(customerId, serviceId);
    fetchWishlist();
  };

  return {
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    loading,
  };
};
