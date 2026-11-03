import api from '../api';


const companySettingsService = {
  // Fetch company settings by ID
  getCompanySettings: async (companyId) => {
    try {
      const response = await api.get(`/v2/superadmin/company-settings/${companyId}`);
      return response.data;
    } catch (error) {
      /* console.error('Error fetching company settings:', error); */
      throw error;
    }
  },

  // Update company settings
  updateCompanySettings: async (formData) => {
    try {
      const response = await api.put('/v2/superadmin/company-settings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      /* console.error('Error updating company settings:', error); */
      throw error;
    }
  },

  // Fetch menu access data
  getMenuAccess: async () => {
    try {
      const response = await api.get('/v2/superadmin/menu-access');
      return response.data.data;
    } catch (error) {
      /* console.error('Error fetching menu access:', error); */
      throw error;
    }
  },

  // Update menu access
  updateMenuAccess: async (id, role, value) => {
    try {
      const response = await api.put(`/v2/superadmin/menu-access/${id}`, {
        role,
        value
      });
      return response.data;
    } catch (error) {
      /* console.error('Error updating menu access:', error); */
      throw error;
    }
  }
};

export default companySettingsService;