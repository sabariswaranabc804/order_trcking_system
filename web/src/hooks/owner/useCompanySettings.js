// useCompanySettings.js
import { useState, useEffect } from 'react';
import API_URL from '../../config';
import { menuAccessData as defaultMenuAccessData } from '../../utils/menu';
import companySettingsService from '../../service/owner/companySettingsService';

const useCompanySettings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [companyData, setCompanyData] = useState({
    name: '',
    logo: '',
    frontPageImage: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    website: ''
  });
  const [logoFile, setLogoFile] = useState(null);
  const [frontPageFile, setFrontPageFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [frontPagePreview, setFrontPagePreview] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const [menuAccessData, setMenuAccessData] = useState(defaultMenuAccessData);

  useEffect(() => {
    const fetchCompanySettings = async () => {
      try {
        const companyId = 1;
        const data = await companySettingsService.getCompanySettings(companyId);
        setCompanyData(data);
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to load company settings' });
      }
    };
    fetchCompanySettings();
  }, []);

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      if (frontPagePreview) URL.revokeObjectURL(frontPagePreview);
    };
  }, [logoPreview, frontPagePreview]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleFrontPageImageChange = (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setFrontPageFile(file);
      setFrontPagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      Object.keys(companyData).forEach(key => {
        if (key !== 'logo' && key !== 'frontPageImage') {
          formData.append(key, companyData[key]);
        }
      });
      if (logoFile) formData.append('logo', logoFile);
      if (frontPageFile) formData.append('frontPageImage', frontPageFile);

      await companySettingsService.updateCompanySettings(formData);
      setMessage({ type: 'success', text: 'Company settings updated successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update company settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleMenuAccessChange = async (id, role, newValue) => {
    try {
      // Update local state
      setMenuAccessData(prevData =>
        prevData.map(item =>
          item.id === id ? { ...item, [role]: newValue } : item
        )
      );

      // Update in database
      await companySettingsService.updateMenuAccess(id, role, newValue);
      setMessage({ type: 'success', text: 'Menu access updated successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update menu access' });
    }
  };

  // Fetch menu access data
  useEffect(() => {
    const fetchMenuAccess = async () => {
      try {
        const data = await companySettingsService.getMenuAccess();
        setMenuAccessData(data);
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to load menu access data' });
      }
    };

    fetchMenuAccess();
  }, []);
  
  return {
    activeTab,
    setActiveTab,
    handleTabChange,
    companyData,
    handleInputChange,
    logoPreview,
    handleLogoChange,
    frontPagePreview,
    handleFrontPageImageChange,
    handleSubmit,
    loading,
    message,
    menuAccessData,
    handleMenuAccessChange
  };
};

export default useCompanySettings;