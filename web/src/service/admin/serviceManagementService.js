import api from '../api';
import API_URL from '../../config';

// Fetch services for a company
const fetchServices = async (companyId) => {
  try {
    const response = await api.get(`/company/${companyId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new service
const createService = async (formData) => {
  try {
    const response = await api({
      method: 'post',
      url: `/service/create`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update an existing service
const updateService = async (serviceId, formData) => {
  try {
    const response = await api({
      method: 'put',
      url: `/service/update/${serviceId}`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a service
const deleteService = async (serviceId) => {
  try {
    const response = await api.put(`/service/delete/${serviceId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { fetchServices, createService, updateService, deleteService };