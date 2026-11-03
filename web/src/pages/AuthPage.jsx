import React from 'react';
import { Box } from '@mui/material';
import AuthForm from '../components/common/AuthForm';
import useAuthForm from '../hooks/common/useAuthForm';
import image from "../assets/image.jpg";

const AuthPage = () => {
  const {
    isLogin,
    showOTP,
    formData,
    loading,
    otpLoading,
    handleChange,
    handleOTPChange,
    handleAuthenticate,
    handleSubmit,
    toggleAuthMode
  } = useAuthForm();

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 3,
    }}>
      <Box sx={{
        width: '100%',
        p: 4,
        borderRadius: 4,
        backdropFilter: 'blur(10px)',
        boxShadow: 5,
        gap: 4,
        display: 'flex',
        maxWidth: 1200,
      }}>
        <AuthForm 
          isLogin={isLogin}
          showOTP={showOTP}
          formData={formData}
          loading={loading}
          otpLoading={otpLoading}
          handleChange={handleChange}
          handleOTPChange={handleOTPChange}
          handleAuthenticate={handleAuthenticate}
          handleSubmit={handleSubmit}
          toggleAuthMode={toggleAuthMode}
        />
     
        <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={image}
            alt="Sign up illustration"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </Box>
      </Box>  
    </Box>
  );
};

export default AuthPage;

