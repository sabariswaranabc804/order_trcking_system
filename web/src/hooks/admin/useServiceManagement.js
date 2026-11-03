import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import API_URL from '../../config';
import { fetchServices, createService, updateService, deleteService } from '../../service/admin/serviceManagementService';

const useServiceManagement = () => {
  // State management
  const [services, setServices] = useState([]);
  const [open, setOpen] = useState(false);
  const [serviceImage, setServiceImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentServiceId, setCurrentServiceId] = useState(null);
  const [newService, setNewService] = useState({
    serviceName: '',
    serviceType: 'Two Way Service',
    organizationName: '',
    place: '',
    serv_Description: 'Fast and reliable water delivery service.',
    created_By: 1
  });

  // Get user and company information
  const { user } = useAuth();
  const userId = user?.user_code;
  const companyId = user?.company_Id;

  // Service types for dropdown
  const serviceTypes = [
    { value: 'one-way', label: 'One Way Service' },
    { value: 'two-way', label: 'Two Way Service' }
  ];

  // Fetch services on component mount
  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await fetchServices(companyId);
        setServices(data);
      } catch (error) {
        toast.error('Failed to load services');
      }
    };

    if (companyId) {
      loadServices();
    }
  }, [companyId]);

  // Dialog handlers
  const handleClickOpen = () => setOpen(true);
  
  const handleClose = () => {
    setOpen(false);
    setNewService({
      serviceName: '',
      serviceType: '',
      organizationName: '',
      place: '',
      serv_Description: 'Fast and reliable water delivery service.',
      created_By: 1,
    });
    setServiceImage(null);
    setImagePreview(null);
    setEditMode(false);
  };

  // Form input handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewService((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setServiceImage(file);
    
    // Create preview URL
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  // Submit handler for create/update
  const handleSubmit = async () => {
    try {
      // Create a FormData object
      const formData = new FormData();
      
      // Append the form fields to FormData
      formData.append('userId', userId);
      formData.append('servType_Name', newService.serviceType);
      formData.append('serv_Name', newService.serviceName);
      formData.append('serv_Description', newService.serv_Description);
      formData.append('created_By', newService.created_By);

      // Check if we are in edit mode, and append service ID if needed
      if (editMode && currentServiceId) {
        formData.append('serv_Id', currentServiceId);
      }

      // Append the image file only if it exists
      if (serviceImage) {
        formData.append('imagefile', serviceImage);
      }

      // Make the API request
      let response;
      if (editMode) {
        response = await updateService(currentServiceId, formData);
      } else {
        response = await createService(formData);
      }

      // Store company_Id in localStorage if available
      if (response.company_Id) {
        localStorage.setItem('company_Id', response.company_Id);
      }

      // Reset the form after submission
      setNewService({
        serviceName: '',
        serviceType: '',
        serv_Description: 'Fast and reliable water delivery service.',
        created_By: 1,
      });
      setServiceImage(null);
      setImagePreview(null);
      setEditMode(false);
      setOpen(false);
      
      // Refresh services data
      const updatedServices = await fetchServices(companyId);
      setServices(updatedServices);
      
      // Show success message
      toast.success(`Service ${editMode ? 'updated' : 'added'} successfully!`);
    } catch (error) {
      toast.error(`Failed to ${editMode ? 'update' : 'add'} service`);
    }
  };

  // Edit handler
  const handleEdit = (service) => {
    setNewService({
      serviceName: service.serv_Name,
      serviceType: service.serv_Type,
      organizationName: service.organization_Name,
      place: service.place,
      serv_Description: service.serv_Description,
      created_By: service.created_By,
    });
    setCurrentServiceId(service.serv_Id);
    
    // Set existing image preview for edit mode
    if (service.imagefile) {
      setImagePreview(`${API_URL}/uploads/product-images/${service.imagefile}`);
    }
    
    setEditMode(true);
    setOpen(true);
  };

  // Delete handler with confirmation
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await deleteService(id);
        
        // Refresh services data
        const updatedServices = await fetchServices(companyId);
        setServices(updatedServices);
        
        toast.success('Service deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete service');
      }
    }
  };

  return {
    services,
    open,
    serviceImage,
    imagePreview,
    newService,
    editMode,
    serviceTypes,
    handleClickOpen,
    handleClose,
    handleInputChange,
    handleImageUpload,
    handleSubmit,
    handleEdit,
    handleDelete,
    setImagePreview,
    setServiceImage
  };
};

export default useServiceManagement;