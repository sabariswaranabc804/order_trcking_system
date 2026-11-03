import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, RadioGroup, FormControlLabel, Radio, Grid, MenuItem, Select, FormControl, InputLabel, Paper, Divider, useTheme, Chip, Alert } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../Home/UserNavbar';
import MapIcon from '@mui/icons-material/Map';
import { useAddAddressForm } from '../../../hooks/user/useAddAddressForm';
import AdvancedMapLibreModal from './AdvancedMapLibreModal'; // ✅ MapLibre alternative

const AddNewAddress = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [isAdminContext, setIsAdminContext] = useState(false);
  const [adminSelectedUserId, setAdminSelectedUserId] = useState(null);

  // Check if this is being accessed from admin context
  useEffect(() => {
    const selectedUserId = sessionStorage.getItem('selectedUserId');
    if (selectedUserId) {
      setIsAdminContext(true);
      setAdminSelectedUserId(selectedUserId);
    }
  }, []);

  const {
    country, setCountry,
    state, setState,
    city, setCity,
    area, setArea,
    street, setStreet,
    floorDoorNumber, setFloorDoorNumber,
    address, setAddress,
    location, setLocation,
    pinCode, setPinCode,
    landmark, setLandmark,
    selectedValue, setSelectedValue,
    phoneNumber, setPhoneNumber,
    postOffices, isLoading, selectedPostOffice,
    handlePostOfficeChange,
    handleMapLocationClick,
    handleCancel,
    handleSubmit
  } = useAddAddressForm(adminSelectedUserId, isAdminContext);

  const handleBackToAdmin = () => {
    // Clear the session storage and navigate back to laundry reception
    sessionStorage.removeItem('selectedUserId');
    navigate('/admin/laundryReception');
  };

  const [openMap, setOpenMap] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);

  // Wrapper function for current location
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setLocation(coords);
        setSelectedCoordinates([position.coords.latitude, position.coords.longitude]);
        /* console.log('Current location set:', coords); */
      }, error => {
        /* console.error('Geolocation error:', error); */
        alert('Failed to get your location. Please try again.');
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };
  return (
    <>
      {!isAdminContext && <UserNavbar />}
      <Box sx={{
        maxWidth: 800,
        margin: 'auto',
        padding: 3,
        bgcolor: theme.palette.background.default,
        minHeight: '100vh'
      }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <AddLocationAltIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />
              {isAdminContext ? 'Add Customer Address' : 'Add New Address'}
            </Typography>
            {isAdminContext && (
              <Button
                variant="outlined"
                color="primary"
                onClick={handleBackToAdmin}
              >
                Back to Order
              </Button>
            )}
          </Box>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, ml: 5 }}>
            {isAdminContext ? 'Add a delivery address for the customer' : 'Add a new delivery address to your account'}
          </Typography>
        </Box>

        {/* Location Selection Section */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 600,
              color: theme.palette.text.primary,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <LocationOnIcon sx={{ color: theme.palette.primary.main }} />
            Select Location
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<MyLocationIcon />}
                onClick={handleCurrentLocation}
                sx={{ py: 1.5 }}
              >
                Use Current Location
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                startIcon={<MapIcon />}
                onClick={() => setOpenMap(true)}
                sx={{ py: 1.5 }}
              >
                Choose on Map
              </Button>
            </Grid>
          </Grid>

          {/* Location Status Feedback */}
          {location.latitude && location.longitude && (
            <Alert
              severity="success"
              sx={{
                mt: 2,
                bgcolor: theme.palette.mode === 'dark'
                  ? 'rgba(46, 125, 50, 0.15)'
                  : 'rgba(46, 125, 50, 0.08)',
                '& .MuiAlert-icon': {
                  color: theme.palette.success.main
                }
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Location Selected
              </Typography>
              <Typography variant="caption">
                Coordinates: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </Typography>
            </Alert>
          )}
        </Paper>


        {/* Address Form Section */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              fontWeight: 600,
              color: theme.palette.text.primary
            }}
          >
            Address Details
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Pin Code"
                variant="outlined"
                fullWidth
                placeholder="Enter 6-digit pincode"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                autoFocus
              />
            </Grid>
            {postOffices.length > 0 && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="post-office-label">Select Area</InputLabel>
                  <Select
                    labelId="post-office-label"
                    value={selectedPostOffice}
                    onChange={handlePostOfficeChange}
                    label="Select Area"
                  >
                    {postOffices.map((po, index) => (
                      <MenuItem key={index} value={po.Name}>
                        {po.Name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Country"
                variant="outlined"
                fullWidth
                value={country}
                InputProps={{
                  readOnly: true,
                  sx: { bgcolor: theme.palette.action.hover }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="State"
                variant="outlined"
                fullWidth
                value={state}
                onChange={(e) => setState(e.target.value)}
                InputProps={{
                  readOnly: true,
                  sx: { bgcolor: theme.palette.action.hover }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="City"
                variant="outlined"
                fullWidth
                placeholder="e.g., Trichy"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Area"
                variant="outlined"
                fullWidth
                placeholder="e.g., Thillai Nagar"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Street"
                variant="outlined"
                fullWidth
                placeholder="e.g., 10th Cross West"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Floor & Door Number"
                variant="outlined"
                placeholder="e.g., D-25"
                fullWidth
                value={floorDoorNumber}
                onChange={(e) => setFloorDoorNumber(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Landmark"
                variant="outlined"
                fullWidth
                placeholder="e.g., Apollo Hospital"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                variant="outlined"
                fullWidth
                placeholder="Enter 10-digit number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleCancel}
            sx={{ px: 4 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSubmit(selectedCoordinates)}
            sx={{ px: 4 }}
          >
            Save Address
          </Button>
        </Box>
      </Box>

      <AdvancedMapLibreModal
        open={openMap}
        onClose={() => setOpenMap(false)}
        onSelectLocation={(pos) => {
          /* console.log('Selected position from map:', pos); */
          setLocation({ latitude: pos.lat, longitude: pos.lng });
          setSelectedCoordinates([pos.lat, pos.lng]);
          /* console.log('Location set to:', { latitude: pos.lat, longitude: pos.lng }); */
          /* console.log('Coordinates set to:', [pos.lat, pos.lng]); */
        }}
      />
    </>
  );
};

export default AddNewAddress;