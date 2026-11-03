import api from '../api';

// Fetch all services for a company
const fetchServices = async (companyId) => {
  try {
    const response = await api.get(`/company/${companyId}`);
    return response.data;
  } catch (error) {
    /* console.error('Error fetching services:', error); */
    throw error;
  }
};

// Fetch all products (service subtypes) for a company
const fetchProducts = async (companyId) => {
  try {
    const response = await api.get(`/serviceSubTypes/${companyId}`);
    return response.data;
  } catch (error) {
    /* console.error('Error fetching products:', error); */
    throw error;
  }
};

// Add a new product
const addProduct = async (productData) => {
  try {
    const response = await api.post('/serviceSubTypes', productData);
    return response.data;
  } catch (error) {
    /* console.error('Error adding product:', error); */
    throw error;
  }
};

// Update an existing product
const updateProduct = async (productId, productData) => {
  try {
    const response = await api.put(`/serviceSubTypes/${productId}`, productData);
    return response.data;
  } catch (error) {
    /* console.error('Error updating product:', error); */
    throw error;
  }
};

// Disable (soft delete) a product
const disableProduct = async (productId) => {
  try {
    const response = await api.put(`/serviceSubTypes/disable/${productId}`);
    return response.data;
  } catch (error) {
    /* console.error('Error disabling product:', error); */
    throw error;
  }
};

export {
  fetchServices,
  fetchProducts,
  addProduct,
  updateProduct,
  disableProduct
};