
import api from '../api';
// Fetch customer feedback
const fetchFeedback = async () => {
  try {
    const response = await api.get(`/customer-feedback`);
    if (response.data.success) {
      return { success: true, data: response.data.data };
    } else {
      /* console.error('Error fetching feedback', response); */
      return { success: false, data: [] };
    }
  } catch (error) {
    /* console.error('Error fetching feedbacks', error); */
    return { success: false, data: [] };
  }
};

// Mock data for customers (to be replaced with actual API calls)
const getSampleCustomers = () => [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    status: 'Active',
    feedback: 'App works well but delivery was late',
    hasDispute: true,
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 'Blacklisted',
    feedback: 'Support team not responsive',
    hasDispute: false,
  },
  {
    id: 3,
    name: 'Ravi Kumar',
    email: 'ravi@sample.com',
    status: 'Active',
    feedback: 'Great service!',
    hasDispute: false,
  },
];

// Handle blacklisting a customer (placeholder for actual implementation)
const blacklistCustomer = async (customerId) => {
  // This would be an actual API call in a real implementation
  /* console.log(`Blacklisting customer ${customerId}`); */
  return { success: true };
};

const customerService = {
  fetchFeedback,
  getSampleCustomers,
  blacklistCustomer
};

export default customerService;