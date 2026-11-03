import { useState, useEffect } from 'react';
import revenueService from '../../service/owner/revenueService';

// Constants
const ADMIN_COST = 1000;
const DELIVERYMEN_COST = 500;

// Helper functions
const getLocalCost = () => {
  const stored = localStorage.getItem("totalCostDetails");
  return stored ? JSON.parse(stored) : { admin: 0, deliverymen: 0, others: 0 };
};

const calculateTotalCost = (details) =>
  details.admin * ADMIN_COST +
  details.deliverymen * DELIVERYMEN_COST +
  details.others;

// Default chart colors
const COLORS = ["#4CAF50", "#2196F3", "#FFC107", "#FF5722"];
const COST_COLORS = ["#f44336", "#e91e63", "#9c27b0", "#673ab7"];

// Default cost data
const costData = [
  { name: "Ad Spend", value: 5000 },
  { name: "Seller Commission", value: 5000 },
  { name: "FBA Fees", value: 5000 },
  { name: "Other", value: 5000 },
];

const useRevenue = () => {
  const [profitPercent, setProfitPercent] = useState(0);
  const [revenueData, setRevenueData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCost, setTotalCost] = useState(20000);
  const [openCostDialog, setOpenCostDialog] = useState(false);
  const [costDetails, setCostDetails] = useState(getLocalCost());
  
  // Calculate total cost whenever costDetails changes
  useEffect(() => {
    const total = calculateTotalCost(costDetails);
    setTotalCost(total);
  }, [costDetails]);
  
  // Fetch order data on component mount
  useEffect(() => {
    fetchOrderData();
  }, []);
  
  // Fetch order data and calculate revenue
  const fetchOrderData = async () => {
    try {
      const orders = await revenueService.getAllOrderDetails();

      // Calculate revenue by order type
      const revenueByType = orders.reduce((acc, order) => {
        const type = order.ordertype === "two-way" ? "Two-Way Service" : "One-Way Service";
        acc[type] = (acc[type] || 0) + order.total_price;
        return acc;
      }, {});

      // Format data for pie chart
      const formattedData = Object.entries(revenueByType).map(([name, value]) => ({
        name,
        value
      }));

      // Calculate total revenue
      const total = formattedData.reduce((sum, item) => sum + item.value, 0);

      setRevenueData(formattedData);
      setTotalRevenue(total);
      
      // Calculate profit percentage
      const profitAmount = total - totalCost;
      const profitPercentage = profitAmount / total;
      setProfitPercent(profitPercentage);

    } catch (error) {
      /* console.error('Error fetching order data:', error); */
    }
  };

  // Handle opening cost dialog
  const handleOpenCostDialog = () => {
    setOpenCostDialog(true);
  };

  // Handle closing cost dialog
  const handleCloseCostDialog = () => {
    setOpenCostDialog(false);
  };

  // Handle saving cost details
  const handleSaveCostDetails = () => {
    localStorage.setItem("totalCostDetails", JSON.stringify(costDetails));
    setOpenCostDialog(false);
  };

  // Handle clearing cost details
  const handleClearCostDetails = () => {
    localStorage.removeItem("totalCostDetails");
    setCostDetails({ admin: 0, deliverymen: 0, others: 0 });
  };

  // Handle cost details change
  const handleCostDetailsChange = (field, value) => {
    setCostDetails(prev => ({
      ...prev,
      [field]: field === 'others' ? parseInt(value || 0) : value
    }));
  };

  return {
    profitPercent,
    revenueData,
    totalRevenue,
    totalCost,
    openCostDialog,
    costDetails,
    costData,
    COLORS,
    COST_COLORS,
    handleOpenCostDialog,
    handleCloseCostDialog,
    handleSaveCostDetails,
    handleClearCostDetails,
    handleCostDetailsChange,
    calculateTotalCost
  };
};

export default useRevenue;