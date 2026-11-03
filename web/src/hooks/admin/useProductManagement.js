import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import {
  fetchServices,
  fetchProducts,
  addProduct,
  updateProduct,
  disableProduct
} from '../../service/admin/productService';

const useProductManagement = () => {
  const { user: userDetails } = useAuth();
  const companyId = userDetails?.company_Id;

  // State variables
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [filteredService, setFilteredService] = useState("All");
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  // Fetch services and products on component mount
  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await fetchServices(companyId);
        setServices(data);
      } catch (error) {
        // Error handling is done in the service
      }
    };

    const loadProducts = async () => {
      try {
        const data = await fetchProducts(companyId);
        setProducts(data);
      } catch (error) {
        // Error handling is done in the service
      }
    };

    if (companyId) {
      loadServices();
      loadProducts();
    }
  }, [companyId]);

  // Handle image upload
  const handleImageUpload = (event) => {
    setProductImage(event.target.files[0]);
  };

  // Dialog handlers
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    resetForm();
    setEditMode(false);
  };

  // Reset form fields
  const resetForm = () => {
    setProductName('');
    setProductPrice('');
    setServiceName('');
    setProductImage(null);
    setEditIndex(null);
    setCurrentProductId(null);
  };

  // Handle adding or updating a product
  const handleAddProduct = async () => {
    const productData = new FormData();
    productData.append('servSubType_Name', productName);
    productData.append('rate', productPrice);
    productData.append('serv_Name', serviceName);
    productData.append('imagefile', productImage);
    productData.append('company_Id', companyId);

    try {
      if (editMode && currentProductId) {
        // Update existing product
        await updateProduct(currentProductId, productData);
        // Update local state
        setProducts(prevProducts => {
          return prevProducts.map(product => {
            if (product.servSubType_Id === currentProductId) {
              return {
                ...product,
                servSubType_Name: productName,
                rate: productPrice,
                // Other fields might not change if not included in the update
              };
            }
            return product;
          });
        });
        toast.success('Product updated successfully!');
      } else {
        // Add new product
        const newProduct = await addProduct(productData);
        setProducts(prevProducts => [...prevProducts, newProduct]);
        toast.success('Product added successfully!');
      }
      setEditMode(false);
      handleCloseDialog();
    } catch (error) {
      toast.error('Error processing product: ' + (error.message || 'Unknown error'));
    }
  };

  // Handle editing a product
  const handleEditProduct = (product) => {
    setOpenDialog(true);
    setProductName(product.servSubType_Name);
    setProductPrice(product.rate);
    setServiceName(product.service);
    setProductImage(product.image);
    setEditMode(true);
    setCurrentProductId(product.servSubType_Id);
  };

  // Handle deleting (disabling) a product
  const handleDeleteProduct = async (product) => {
    try {
      await disableProduct(product.servSubType_Id);
      // Update local state to remove the disabled product
      setProducts(prevProducts => 
        prevProducts.filter(p => p.servSubType_Id !== product.servSubType_Id)
      );
      toast.success('Product disabled successfully!');
    } catch (error) {
      toast.error('Error disabling product: ' + (error.message || 'Unknown error'));
    }
  };

  // Filter products by service name
  const filteredProducts = filteredService === "All"
    ? products
    : products.filter((product) => 
        product.serv_Name?.toLowerCase() === filteredService
      );

  return {
    products,
    services,
    filteredProducts,
    filteredService,
    setFilteredService,
    productName,
    setProductName,
    productPrice,
    setProductPrice,
    serviceName,
    setServiceName,
    productImage,
    handleImageUpload,
    openDialog,
    handleOpenDialog,
    handleCloseDialog,
    editMode,
    editIndex,
    handleAddProduct,
    handleEditProduct,
    handleDeleteProduct,
    companyId
  };
};

export default useProductManagement;