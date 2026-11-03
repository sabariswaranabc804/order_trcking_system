import React from 'react';
import {
  Card, CardActionArea, CardContent, Typography, Radio, FormControlLabel,
  Button, Box, FormControl, FormLabel, RadioGroup, IconButton, Grid, Snackbar,
  CircularProgress, Paper, Divider, useTheme, Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaymentIcon from '@mui/icons-material/Payment';
import QRCode from 'react-qr-code';
import { CopyAll as CopyIcon } from '@mui/icons-material';
import UserNavbar from '../Home/UserNavbar';
import useDeliveryAddress from '../../../hooks/user/useDeliveryAddress';

const DeliveryAddress = () => {
  const theme = useTheme();
  const {
    addresses,
    selectedAddress,
    setSelectedAddress,
    paymentMethod,
    setPaymentMethod,
    paymentProcessing,
    showAllAddresses,
    toggleShowAll,
    displayedAddresses,
    handleCardClick,
    handleDelete,
    handleSubmitOrder,
    gpayLink,
    gpayNumber,
    copied,
    totalPrice,
  } = useDeliveryAddress();

  const navigate = useNavigate();

  return (
    <>
      <UserNavbar />
      <Box sx={{
        maxWidth: 800,
        margin: 'auto',
        padding: 3,
        bgcolor: theme.palette.background.default,
        minHeight: '100vh'
      }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="div"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <LocationOnIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />
            Delivery Address
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, ml: 5 }}>
            Select or add a delivery address for your order
          </Typography>
        </Box>

        {/* Add New Address Button */}
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          startIcon={<AddLocationAltIcon />}
          onClick={() => navigate('/addaddress')}
          disabled={paymentProcessing}
          sx={{
            mb: 3,
            py: 1.5,
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
            }
          }}
        >
          Add a New Address
        </Button>

        {/* Addresses Section */}
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
              color: theme.palette.text.primary
            }}
          >
            Saved Addresses
          </Typography>

          {addresses.length === 0 ? (
            <Box sx={{
              textAlign: 'center',
              py: 4,
              color: theme.palette.text.secondary
            }}>
              <LocationOnIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
              <Typography variant="body1">No saved addresses found.</Typography>
              <Typography variant="body2">Add a new address to continue</Typography>
            </Box>
          ) : (
            <>
              {displayedAddresses.map((address, index) => (
                <Card
                  key={index}
                  sx={{
                    mb: 2,
                    border: selectedAddress === index
                      ? `2px solid ${theme.palette.primary.main}`
                      : `1px solid ${theme.palette.divider}`,
                    bgcolor: selectedAddress === index
                      ? theme.palette.mode === 'dark'
                        ? 'rgba(122, 215, 204, 0.08)'
                        : 'rgba(65, 179, 163, 0.05)'
                      : theme.palette.background.paper,
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'visible',
                    '&:hover': {
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 4px 12px rgba(0,0,0,0.4)'
                        : '0 4px 12px rgba(0,0,0,0.1)',
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
                        top: -10,
                        right: 16,
                        fontWeight: 600
                      }}
                    />
                  )}
                  <CardActionArea
                    onClick={() => !paymentProcessing && setSelectedAddress(index)}
                    disabled={paymentProcessing}
                    sx={{
                      opacity: paymentProcessing ? 0.6 : 1,
                      cursor: paymentProcessing ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <CardContent>
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={1}>
                          <Radio
                            checked={selectedAddress === index}
                            onChange={() => !paymentProcessing && setSelectedAddress(index)}
                            disabled={paymentProcessing}
                            sx={{
                              color: theme.palette.text.secondary,
                              '&.Mui-checked': {
                                color: theme.palette.primary.main,
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={selectedAddress === index ? 9 : 11}>
                          <Box>
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
                              sx={{
                                color: theme.palette.primary.main,
                                '&:hover': {
                                  bgcolor: theme.palette.action.hover
                                }
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCardClick('/editaddress');
                              }}
                              disabled={paymentProcessing}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              sx={{
                                color: theme.palette.error.main,
                                '&:hover': {
                                  bgcolor: theme.palette.action.hover
                                }
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete();
                              }}
                              disabled={paymentProcessing}
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

              {addresses.length > 2 && (
                <Button
                  variant="text"
                  onClick={toggleShowAll}
                  disabled={paymentProcessing}
                  sx={{
                    mt: 1,
                    color: theme.palette.primary.main,
                    '&:hover': {
                      bgcolor: theme.palette.action.hover
                    }
                  }}
                  endIcon={showAllAddresses ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                >
                  {showAllAddresses ? 'Show Less' : `Show ${addresses.length - 2} More`}
                </Button>
              )}
            </>
          )}
        </Paper>

        {/* Payment Method Section */}
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
            <PaymentIcon sx={{ color: theme.palette.primary.main }} />
            Payment Method
          </Typography>

          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              aria-label="payment-method"
              name="payment-method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    border: paymentMethod === 'offline'
                      ? `2px solid ${theme.palette.primary.main}`
                      : `1px solid ${theme.palette.divider}`,
                    bgcolor: paymentMethod === 'offline'
                      ? theme.palette.mode === 'dark'
                        ? 'rgba(122, 215, 204, 0.08)'
                        : 'rgba(65, 179, 163, 0.05)'
                      : 'transparent',
                    borderRadius: 1,
                    transition: 'all 0.2s'
                  }}
                >
                  <FormControlLabel
                    value="offline"
                    control={<Radio disabled={paymentProcessing} />}
                    label={
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                          Cash on Delivery (COD)
                        </Typography>
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                          Pay when you receive your order
                        </Typography>
                      </Box>
                    }
                    disabled={paymentProcessing}
                  />
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    border: paymentMethod === 'online'
                      ? `2px solid ${theme.palette.primary.main}`
                      : `1px solid ${theme.palette.divider}`,
                    bgcolor: paymentMethod === 'online'
                      ? theme.palette.mode === 'dark'
                        ? 'rgba(122, 215, 204, 0.08)'
                        : 'rgba(65, 179, 163, 0.05)'
                      : 'transparent',
                    borderRadius: 1,
                    transition: 'all 0.2s'
                  }}
                >
                  <FormControlLabel
                    value="online"
                    control={<Radio disabled={paymentProcessing} />}
                    label={
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                          Razorpay
                        </Typography>
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                          Credit/Debit Card, UPI, Net Banking
                        </Typography>
                      </Box>
                    }
                    disabled={paymentProcessing}
                  />
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    border: paymentMethod === 'verify'
                      ? `2px solid ${theme.palette.primary.main}`
                      : `1px solid ${theme.palette.divider}`,
                    bgcolor: paymentMethod === 'verify'
                      ? theme.palette.mode === 'dark'
                        ? 'rgba(122, 215, 204, 0.08)'
                        : 'rgba(65, 179, 163, 0.05)'
                      : 'transparent',
                    borderRadius: 1,
                    transition: 'all 0.2s'
                  }}
                >
                  <FormControlLabel
                    value="verify"
                    control={<Radio disabled={paymentProcessing} />}
                    label={
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                          GPay / UPI Payment
                        </Typography>
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                          Pay via QR code or UPI number
                        </Typography>
                      </Box>
                    }
                    disabled={paymentProcessing}
                  />
                </Paper>
              </Box>
            </RadioGroup>
          </FormControl>

          {paymentMethod === 'online' && (
            <Box sx={{
              mt: 2,
              p: 2,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(122, 215, 204, 0.05)' : 'rgba(65, 179, 163, 0.08)',
              borderRadius: 1,
              border: `1px solid ${theme.palette.primary.main}40`
            }}>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                🔒 You will be redirected to Razorpay secure payment gateway after clicking "Proceed to Payment".
              </Typography>
            </Box>
          )}

          {paymentMethod === 'verify' && (
            <Box sx={{
              mt: 2,
              p: 3,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(122, 215, 204, 0.05)' : 'rgba(65, 179, 163, 0.08)',
              borderRadius: 2,
              border: `1px solid ${theme.palette.primary.main}40`
            }}>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  color: theme.palette.text.primary
                }}
              >
                Scan QR Code or Use UPI Number
              </Typography>

              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} sm={5}>
                  <Box sx={{
                    p: 2,
                    bgcolor: 'white',
                    borderRadius: 2,
                    display: 'flex',
                    justifyContent: 'center'
                  }}>
                    <QRCode value={gpayLink} size={140} />
                  </Box>
                </Grid>

                <Grid item xs={12} sm={2} sx={{ textAlign: 'center' }}>
                  <Divider sx={{ display: { xs: 'block', sm: 'none' } }}>
                    <Chip label="OR" size="small" />
                  </Divider>
                  <Typography
                    variant="h6"
                    sx={{
                      display: { xs: 'none', sm: 'block' },
                      color: theme.palette.text.secondary
                    }}
                  >
                    OR
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={5}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        UPI Number
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          fontFamily: 'monospace'
                        }}
                      >
                        {gpayNumber}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        Total Amount
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.primary.main
                        }}
                      >
                        ₹{totalPrice}
                      </Typography>
                    </Box>

                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      startIcon={<CopyIcon />}
                      disabled={paymentProcessing}
                      sx={{ mt: 1 }}
                    >
                      Copy UPI Number
                    </Button>
                  </Box>
                </Grid>
              </Grid>

              {copied && (
                <Snackbar
                  open={copied}
                  message="Number copied to clipboard!"
                  autoHideDuration={2000}
                />
              )}
            </Box>
          )}
        </Paper>

        {/* Submit Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          sx={{
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            '&:disabled': {
              bgcolor: theme.palette.action.disabledBackground,
              color: theme.palette.action.disabled
            }
          }}
          onClick={handleSubmitOrder}
          disabled={paymentProcessing || selectedAddress === null}
        >
          {paymentProcessing ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              Processing Order...
            </Box>
          ) : (
            paymentMethod === 'online' ? 'Proceed to Payment' : 'Place Order'
          )}
        </Button>
      </Box>
    </>
  );
};

export default DeliveryAddress;