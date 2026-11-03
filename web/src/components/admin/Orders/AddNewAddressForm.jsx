import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const AddNewAddressForm = ({ 
  open, 
  onClose, 
  onAddressAdded, 
  selectedUserId 
}) => {
  const [formData, setFormData] = useState({
    country: 'India',
    state: '',
    city: '',
    area: '',
    street: '',
    floorDoorNumber: '',
    address: '',
    landmark: '',
    pinCode: '',
    phoneNumber: '',
    addressType: 'Home'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.pinCode || !formData.city || !formData.area) {
      setError('Please fill in required fields: Pin Code, City, and Area');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create the full address string
      const fullAddress = `${formData.street} ${formData.floorDoorNumber} ${formData.area} ${formData.city}`.trim();
      
      const addressData = {
        user_ID: selectedUserId,
        address: fullAddress,
        Area: formData.area,
        Street: formData.street,
        Floor_Door_no: formData.floorDoorNumber,
        Landmark: formData.landmark,
        pin_Code: formData.pinCode,
        AddressType: formData.addressType,
        mobile_number: formData.phoneNumber,
        state_Id: 1, // Default state ID
        city_Id: 1,  // Default city ID
        location_Id: 1, // Default location ID
        active_Flag: 1
      };

      // Call API to save address
      const response = await fetch('/api/v2/admin/user-addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData)
      });

      if (response.ok) {
        const result = await response.json();
        onAddressAdded(result.data);
        handleClose();
      } else {
        throw new Error('Failed to save address');
      }
    } catch (err) {
      setError('Failed to save address. Please try again.');
      /* console.error('Error saving address:', err); */
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      country: 'India',
      state: '',
      city: '',
      area: '',
      street: '',
      floorDoorNumber: '',
      address: '',
      landmark: '',
      pinCode: '',
      phoneNumber: '',
      addressType: 'Home'
    });
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Add New Address</Typography>
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Pin Code *"
              variant="outlined"
              fullWidth
              value={formData.pinCode}
              onChange={handleInputChange('pinCode')}
              placeholder="Enter 6-digit pincode"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Address Type</InputLabel>
              <Select
                value={formData.addressType}
                onChange={handleInputChange('addressType')}
                label="Address Type"
              >
                <MenuItem value="Home">Home</MenuItem>
                <MenuItem value="Office">Office</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Country"
              variant="outlined"
              fullWidth
              value={formData.country}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="State"
              variant="outlined"
              fullWidth
              value={formData.state}
              onChange={handleInputChange('state')}
              placeholder="Enter state"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="City *"
              variant="outlined"
              fullWidth
              value={formData.city}
              onChange={handleInputChange('city')}
              placeholder="e.g., Trichy"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Area *"
              variant="outlined"
              fullWidth
              value={formData.area}
              onChange={handleInputChange('area')}
              placeholder="e.g., Thillai Nagar"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Street"
              variant="outlined"
              fullWidth
              value={formData.street}
              onChange={handleInputChange('street')}
              placeholder="e.g., 10th cross west"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Floor & Door Number"
              variant="outlined"
              fullWidth
              value={formData.floorDoorNumber}
              onChange={handleInputChange('floorDoorNumber')}
              placeholder="e.g., D-25"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Landmark"
              variant="outlined"
              fullWidth
              value={formData.landmark}
              onChange={handleInputChange('landmark')}
              placeholder="e.g., Apollo city center hospital"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              value={formData.phoneNumber}
              onChange={handleInputChange('phoneNumber')}
              placeholder="Enter phone number"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Address'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddNewAddressForm;