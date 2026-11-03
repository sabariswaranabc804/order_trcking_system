import axios from 'axios';
import API_URL from '../../config';

// Fetch all deliverymen/anchors
const fetchAnchors = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/deliveryman/`);
    return response.data;
  } catch (error) {
    /* console.error('Error fetching anchors:', error); */
    return [];
  }
};

// Disable/delete a deliveryman
const disableAnchor = async (id) => {
  try {
    await axios.put(`${API_URL}/api/deliveryman/disable/${id}`);
    return { success: true, message: 'Deliveryman disabled successfully!' };
  } catch (error) {
    /* console.error('Error disabling deliveryman:', error); */
    return { success: false, message: 'Failed to disable deliveryman' };
  }
};

// Create a new deliveryman/anchor
const createAnchor = async (anchorData) => {
  try {
    const response = await axios.post(`${API_URL}/api/create/deliveryman`, anchorData);
    return { success: true, data: response.data };
  } catch (error) {
    /* console.error('Error creating deliveryman:', error); */
    return { success: false, error };
  }
};

// Update an existing deliveryman/anchor
const updateAnchor = async (id, anchorData) => {
  try {
    await axios.put(`${API_URL}/api/deliveryman/edit/${id}`, anchorData);
    return { success: true, message: 'Deliveryman updated successfully!' };
  } catch (error) {
    /* console.error('Error updating deliveryman:', error); */
    return { success: false, message: 'Failed to update deliveryman' };
  }
};

// Export utility function for Excel export
const exportToExcelData = (data) => {
  return data.map(row => ({
    'S.No': row.sno,
    'Name': row.deliveryman_name,
    'Phone Number': row.contact,
    'Alternative Number': row.alternativeNumber,
    'Email': row.email,
    'City': row.city,
    'Address': row.address
  }));
};

const anchorService = {
  fetchAnchors,
  disableAnchor,
  createAnchor,
  updateAnchor,
  exportToExcelData
};

export default anchorService;