import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 10 }}>
      <Box component="img" src="https://img.freepik.com/free-vector/401-error-unauthorized-concept-illustration_114360-1934.jpg?uid=R113678162&ga=GA1.1.1558421036.1729161363&semt=ais_hybrid&w=740" alt="Unauthorized" sx={{ width: '100%', maxHeight: 600, mb: 4 }} />
      <Typography variant="h4" gutterBottom>401 - Unauthorized</Typography>
      <Typography variant="body1" gutterBottom>You don’t have permission to access this page.</Typography>
      <Button variant="contained" onClick={() => navigate('/')}>Go to Home Page</Button>
    </Container>
  );
};

export default Unauthorized;
