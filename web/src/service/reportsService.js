

const API_URL = import.meta.env.VITE_API_URL;

export const getRevenueData = async () => {
  try {
    const response = await fetch(`${API_URL}/v2/superadmin/reports/revenue`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch revenue data');
    }

    return data.data;
  } catch (error) {
    /* console.error('Error fetching revenue data:', error); */
    throw error;
  }
};

export const getMonthlyRevenueData = async () => {
  try {
    const response = await fetch(`${API_URL}/v2/superadmin/reports/monthly-revenue`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch monthly revenue data');
    }

    return data.data;
  } catch (error) {
    /* console.error('Error fetching monthly revenue data:', error); */
    throw error;
  }
};

export const getServiceUsageData = async () => {
  try {
    const response = await fetch(`${API_URL}/v2/superadmin/reports/service-usage`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch service usage data');
    }

    return data.data;
  } catch (error) {
    /* console.error('Error fetching service usage data:', error); */
    throw error;
  }
};