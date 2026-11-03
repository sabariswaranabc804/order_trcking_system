import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import anchorService from '../../service/admin/anchorService';
import * as XLSX from 'xlsx';

const useAnchorManagement = () => {
  const [rows, setRows] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    alternativePhoneNumber: '',
    email: '',
    address: '',
    city: ''
  });

  const navigate = useNavigate();
  const { user: userDetails } = useAuth();
  const companyId = userDetails?.company_Id;

  // Load anchors on component mount
  useEffect(() => {
    fetchAnchors();
  }, []);

  // Fetch anchors from API
  const fetchAnchors = async () => {
    const data = await anchorService.fetchAnchors();
    setRows(data);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Reset form fields
  const resetForm = () => {
    setFormData({
      name: '',
      phoneNumber: '',
      alternativePhoneNumber: '',
      email: '',
      address: '',
      city: ''
    });
    setSelectedRow(null);
    setIsEditing(false);
  };

  // Open dialog for creating new anchor
  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
    setIsEditing(false);
  };

  // Close dialog and reset form
  const closeDialog = () => {
    setDialogOpen(false);
    resetForm();
  };

  // Handle edit anchor
  const handleEdit = (row) => {
    setSelectedRow(row);
    setFormData({
      name: row.deliveryman_name,
      phoneNumber: row.contact,
      alternativePhoneNumber: row.alternativeNumber,
      email: row.email,
      address: row.address,
      city: row.city
    });
    setDialogOpen(true);
    setIsEditing(true);
  };

  // Handle delete anchor
  const handleDelete = async (id) => {
    const result = await anchorService.disableAnchor(id);
    if (result.success) {
      setRows(prevRows => prevRows.filter(row => row.deliveryman_id !== id));
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  // Handle save anchor (create or update)
  const handleSaveAnchor = async () => {
    const anchorData = {
      user_Name: formData.name,
      mobile_Number: formData.phoneNumber,
      alternativeNumber: formData.alternativePhoneNumber,
      email_ID: formData.email,
      city: formData.city,
      address: formData.address,
      company_Id: companyId
    };

    if (isEditing && selectedRow) {
      const result = await anchorService.updateAnchor(selectedRow.deliveryman_id, anchorData);
      if (result.success) {
        setRows(prevRows => 
          prevRows.map(row => 
            row.deliveryman_id === selectedRow.deliveryman_id ? 
            { ...row, 
              deliveryman_name: formData.name,
              contact: formData.phoneNumber,
              alternativeNumber: formData.alternativePhoneNumber,
              email: formData.email,
              address: formData.address,
              city: formData.city 
            } : row
          )
        );
        toast.success("Anchor updated successfully!");
      } else {
        toast.error("Failed to update anchor");
      }
    } else {
      const result = await anchorService.createAnchor(anchorData);
      if (result.success) {
        navigate("/");
        toast.success("Anchor added successfully!");
      } else {
        toast.error("Failed to add anchor");
      }
    }

    closeDialog();
  };

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(anchorService.exportToExcelData(rows));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Anchors');
    XLSX.writeFile(workbook, 'anchors.xlsx');
  };

  // Add serial numbers to rows
  const rowsWithSno = rows.map((row, index) => ({
    ...row,
    sno: index + 1
  }));

  return {
    rows: rowsWithSno,
    dialogOpen,
    isEditing,
    formData,
    handleInputChange,
    openCreateDialog,
    closeDialog,
    handleEdit,
    handleDelete,
    handleSaveAnchor,
    exportToExcel
  };
};

export default useAnchorManagement;