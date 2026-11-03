import axios from 'axios';
import API_URL from '../../config';

// Fetch all customers
const fetchCustomers = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/customer`);
    return { success: true, data: response.data.data };
  } catch (error) {
    /* console.error('Error fetching customers:', error); */
    return { success: false, error: error.message, data: [] };
  }
};

// Create a new customer
const createCustomer = async (customerData) => {
  try {
    const response = await axios.post(`${API_URL}/api/users`, customerData);
    return { success: true, data: response.data };
  } catch (error) {
    /* console.error('Error creating customer:', error); */
    return { success: false, error: error.message };
  }
};

// Default customer form data
const getDefaultCustomerData = () => ({
  name: '', 
  phoneNumber: '', 
  email: '',
  alternativePhoneNumber:'',
  country: 'India', 
  area: 'Annamalai Nagar', 
  state: 'tamilnadu', 
  city: 'Trichy', 
  street: 'Kumudham Salai', 
  floorDoorNumber: '1 floor', 
  door: 'NO 12', 
  pincode: '620018', 
  landmark: '620018',
  location: {
    latitude: '10.8278097', 
    longitude: '78.6844134'
  }
});

const customerService = {
  fetchCustomers,
  createCustomer,
  getDefaultCustomerData
};

export default customerService;