import React from 'react';
import {
  Box, Button, Card, CardActionArea, CardContent, Typography,
  IconButton, Grid, FormControlLabel, Radio, Paper, useTheme, Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import UserNavbar from '../Home/UserNavbar';
import { useAuth } from '../../../context/AuthContext';
import { useUserAddresses } from '../../../hooks/user/useUserAddresses';

const UserAddress = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
  const userId = user?.user_code;

  const {
    addresses,
    selectedAddress,
    setSelectedAddress,
    showAllAddresses,
    toggleShowAll,
    deleteByAddress
  } = useUserAddresses(userId);

  const displayedAddresses = showAllAddresses ? addresses : addresses.slice(0, 6);

  const handleEdit = () => {
    if (selectedAddress === null) return;
    const selectedAddressData = addresses[selectedAddress];
    navigate('/editaddress', { state: { address: selectedAddressData } });
  };

  return (
    <>
      <UserNavbar />
      <Box sx={{ 
        bgcolor: theme.palette.background.default,
        minHeight: '100vh',
        py: 4
      }}>
        <Box sx={{ maxWidth: 900, margin: 'auto', px: 3 }}>
          {/* Header Section */}
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 600,
                color: theme.palette.text.primary,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 1
              }}
            >
              <HomeIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />
              My Addresses
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, ml: 5 }}>
              Manage your saved delivery addresses
            </Typography>
          </Box>

          {/* Add New Address Button */}
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            size="large"
            startIcon={<AddLocationAltIcon />}
            onClick={() => navigate('/addaddress')}
            sx={{
              mb: 3,
              py: 1.5,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              }
            }}
          >
            Add New Address
          </Button>

          {/* Addresses List */}
          <Paper 
            elevation={0}
            sx={{ 
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            {addresses.length === 0 ? (
              <Box sx={{ 
                p: 8, 
                textAlign: 'center'
              }}>
                <LocationOnIcon 
                  sx={{ 
                    fontSize: 80, 
                    color: theme.palette.text.disabled,
                    mb: 2 
                  }} 
                />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 1,
                    color: theme.palette.text.primary,
                    fontWeight: 500
                  }}
                >
                  No saved addresses
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: theme.palette.text.secondary 
                  }}
                >
                  Add your first address to get started
                </Typography>
              </Box>
            ) : (
              <>
                {displayedAddresses.map((address, index) => (
                  <Card 
                    key={index}
                    elevation={0}
                    sx={{ 
                      mb: index < displayedAddresses.length - 1 ? 0 : 0,
                      border: selectedAddress === index 
                        ? `2px solid ${theme.palette.primary.main}` 
                        : `1px solid ${theme.palette.divider}`,
                      borderRadius: 0,
                      borderLeft: 'none',
                      borderRight: 'none',
                      borderTop: index === 0 ? 'none' : `1px solid ${theme.palette.divider}`,
                      bgcolor: selectedAddress === index 
                        ? theme.palette.mode === 'dark' 
                          ? 'rgba(122, 215, 204, 0.08)' 
                          : 'rgba(65, 179, 163, 0.05)'
                        : 'transparent',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      '&:hover': {
                        bgcolor: selectedAddress === index 
                          ? theme.palette.mode === 'dark' 
                            ? 'rgba(122, 215, 204, 0.12)' 
                            : 'rgba(65, 179, 163, 0.08)'
                          : theme.palette.action.hover,
                      }
                    }}
                  >
                    {selectedAddress === index && (
                      <Chip 
                        label="Selected" 
                        size="small"
                        color="primary"
                        sx={{ 
                          position: 'absolute', 
                          top: 12, 
                          right: 16,
                          fontWeight: 600,
                          zIndex: 1
                        }} 
                      />
                    )}
                    <CardActionArea
                      onClick={() => setSelectedAddress(index)}
                    >
                      <CardContent sx={{ py: 2.5 }}>
                        <Grid container alignItems="center" spacing={2}>
                          <Grid item xs={1}>
                            <Radio
                              checked={selectedAddress === index}
                              sx={{
                                color: theme.palette.text.secondary,
                                '&.Mui-checked': {
                                  color: theme.palette.primary.main,
                                }
                              }}
                            />
                          </Grid>
                          <Grid item xs={selectedAddress === index ? 9 : 11}>
                            <Box sx={{ pr: selectedAddress === index ? 8 : 0 }}>
                              <Typography 
                                variant="body1"
                                sx={{ 
                                  fontWeight: 600, 
                                  textTransform: 'capitalize',
                                  color: theme.palette.text.primary,
                                  mb: 0.5
                                }}
                              >
                                {address.Street}, {address.Area}
                              </Typography>
                              <Typography 
                                variant="body2"
                                sx={{ 
                                  textTransform: 'capitalize',
                                  color: theme.palette.text.secondary
                                }}
                              >
                                {address.city_Id}, {address.state_Id} - {address.pin_Code}
                              </Typography>
                            </Box>
                          </Grid>
                          {selectedAddress === index && (
                            <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                              <IconButton 
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit();
                                }}
                                sx={{ 
                                  color: theme.palette.primary.main,
                                  '&:hover': {
                                    bgcolor: theme.palette.action.hover
                                  }
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteByAddress();
                                }}
                                sx={{ 
                                  color: theme.palette.error.main,
                                  '&:hover': {
                                    bgcolor: theme.palette.action.hover
                                  }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Grid>
                          )}
                        </Grid>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                ))}
              </>
            )}
          </Paper>

          {/* Show More/Less Button */}
          {addresses.length > 6 && (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                variant="text"
                onClick={toggleShowAll}
                endIcon={showAllAddresses ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                sx={{
                  color: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: theme.palette.action.hover
                  }
                }}
              >
                {showAllAddresses ? 'Show Less' : `Show ${addresses.length - 6} More`}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default UserAddress;
