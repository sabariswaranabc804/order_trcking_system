import React from 'react';
import { Box, TextField, Button, Typography, Link, CircularProgress, Paper, Divider, useTheme, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';

const AuthForm = ({
  isLogin,
  showOTP,
  formData,
  handleChange,
  handleOTPChange,
  handleAuthenticate,
  handleSubmit,
  toggleAuthMode,
  loading = false,
  otpLoading = false
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ flex: 1, maxWidth: 500 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{
          display: 'inline-flex',
          p: 2,
          borderRadius: '50%',
          bgcolor: theme.palette.mode === 'dark'
            ? 'rgba(122, 215, 204, 0.15)'
            : 'rgba(65, 179, 163, 0.1)',
          mb: 2
        }}>
          {isLogin ? (
            <LockOutlinedIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
          ) : (
            <PersonAddOutlinedIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
          )}
        </Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 1
          }}
        >
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary }}
        >
          {isLogin
            ? 'Enter your credentials to access your account'
            : 'Sign up to get started with our services'}
        </Typography>
      </Box>

      {/* Form Card */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2
        }}
      >
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <PersonIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Mobile Number"
                name="mobile"
                type="tel"
                value={formData.mobile}
                onChange={handleChange}
                margin="normal"
                placeholder="Enter 10-digit mobile number"
                InputProps={{
                  startAdornment: (
                    <PhoneIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                  ),
                }}
                sx={{ mb: 2 }}
              />
            </>
          )}

          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              readOnly: showOTP,
              startAdornment: (
                <EmailIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
              ),
            }}
            sx={{
              mb: 2,
              '& .MuiInputBase-input': {
                bgcolor: showOTP ? theme.palette.action.hover : 'transparent'
              }
            }}
          />

          {!showOTP ? (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleAuthenticate}
              disabled={loading}
              sx={{
                mt: 2,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none'
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  {isLogin ? 'Sending OTP...' : 'Creating Account...'}
                </Box>
              ) : (
                isLogin ? 'Send OTP' : 'Create Account'
              )}
            </Button>
          ) : (
            <Box sx={{ mt: 2 }}>
              <Alert
                severity="info"
                sx={{
                  mb: 3,
                  bgcolor: theme.palette.mode === 'dark'
                    ? 'rgba(33, 150, 243, 0.15)'
                    : 'rgba(33, 150, 243, 0.08)'
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Enter the 6-digit OTP sent to your email
                </Typography>
              </Alert>

              <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', mb: 3 }}>
                {formData.otp.map((digit, index) => (
                  <TextField
                    key={index}
                    name={`otp-${index}`}
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace') {
                        if (digit === '' && index > 0) {
                          const prevInput = document.querySelector(`input[name=otp-${index - 1}]`);
                          if (prevInput) {
                            prevInput.focus();
                            handleOTPChange(index - 1, '');
                          }
                        } else {
                          handleOTPChange(index, '');
                        }
                      } else if (e.key === 'ArrowLeft' && index > 0) {
                        const prevInput = document.querySelector(`input[name=otp-${index - 1}]`);
                        if (prevInput) prevInput.focus();
                      } else if (e.key === 'ArrowRight' && index < 5) {
                        const nextInput = document.querySelector(`input[name=otp-${index + 1}]`);
                        if (nextInput) nextInput.focus();
                      }
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      const pasteData = e.clipboardData.getData('text');
                      const digits = pasteData.replace(/\D/g, '').slice(0, 6);

                      if (digits.length > 0) {
                        for (let i = 0; i < digits.length && (index + i) < 6; i++) {
                          handleOTPChange(index + i, digits[i]);
                        }
                        const nextEmptyIndex = Math.min(index + digits.length, 5);
                        const nextInput = document.querySelector(`input[name=otp-${nextEmptyIndex}]`);
                        if (nextInput) nextInput.focus();
                      }
                    }}
                    sx={{
                      width: '50px',
                      '& input': {
                        textAlign: 'center',
                        padding: '12px',
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        color: theme.palette.text.primary
                      },
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: theme.palette.primary.main,
                          borderWidth: 2
                        }
                      }
                    }}
                    inputProps={{
                      maxLength: 1
                    }}
                  />
                ))}
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={otpLoading}
                sx={{
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none'
                }}
              >
                {otpLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    Verifying OTP...
                  </Box>
                ) : (
                  'Verify & Login'
                )}
              </Button>
            </Box>
          )}

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              OR
            </Typography>
          </Divider>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Link
                href="#"
                onClick={toggleAuthMode}
                sx={{
                  color: (loading || otpLoading) ? theme.palette.text.disabled : theme.palette.primary.main,
                  fontWeight: 600,
                  textDecoration: 'none',
                  pointerEvents: (loading || otpLoading) ? 'none' : 'auto',
                  cursor: (loading || otpLoading) ? 'not-allowed' : 'pointer',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                {isLogin ? 'Create Account' : 'Sign In'}
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AuthForm;