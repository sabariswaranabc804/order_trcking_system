import {
  Grid,
  Card,
  CardContent,
  Typography,
  Autocomplete,
  TextField,
  Box,
  Button,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

const AddressSelection = ({
  userAddresses,
  selectedAddress,
  handleAddressChange,
  orderServiceType,
  selectedUserId
}) => {
  const navigate = useNavigate();

  // Don't render if service type is not one-way
  if (orderServiceType !== 'one-way') {
    return null;
  }

  const handleAddNewAddress = () => {
    /* console.log("se", selectedUserId); */

    // Store the current user ID in localStorage or sessionStorage for the add address page
    sessionStorage.setItem('selectedUserId', selectedUserId);
    navigate('/addaddress');
  };

  // Format addresses for autocomplete
  const formattedAddresses = userAddresses?.map(address => ({
      label: `${address.AddressType || 'Address'} - ${address.city_Id || ''}- ${address.Area || ''}-${address.Street || ''} -${address.Floor_Door_no || ''} -${address.Landmark || ''} -  ${address.pin_Code || ''}`.trim(),
    UAID: address.UAID,
    ...address
  })) || [];

  return (
    <>
      <Grid item xs={12}>
        <Card sx={{ padding: 2, marginTop: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Select Delivery Address
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddNewAddress}
                size="small"
              >
                Add New Address
              </Button>
            </Box>

            {!userAddresses || userAddresses.length === 0 ? (
              <Alert severity="info" sx={{ mb: 2 }}>
                No addresses found for this user. Please add a new address to continue.
              </Alert>
            ) : (
              <Autocomplete
                options={formattedAddresses.map(addr => addr.label)}
                value={selectedAddress}
                onChange={handleAddressChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Choose Address"
                    placeholder="Select delivery address"
                    variant="outlined"
                    fullWidth
                  />
                )}
                sx={{ marginTop: 1 }}
              />
            )}

            {selectedAddress && (
              <Box sx={{ marginTop: 2, padding: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="primary">
                  Selected Address:
                </Typography>
                <Typography variant="body2" sx={{ marginTop: 1 }}>
                  {selectedAddress}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default AddressSelection;