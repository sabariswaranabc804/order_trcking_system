import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 10 }}>
      <Box component="img" src="https://img.freepik.com/free-vector/error-404-concept-landing-page_114360-2279.jpg?uid=R113678162&ga=GA1.1.1558421036.1729161363&semt=ais_hybrid&w=740 " alt="404 Not Found" sx={{ width: '100%', maxHeight: 600, mb: 4 }} />
      <Typography variant="h4" gutterBottom>404 - Page Not Found</Typography>
      <Typography variant="body1" gutterBottom>The page you are looking for does not exist.</Typography>
      <Button variant="contained" onClick={() => navigate('/')}>Go to Home Page</Button>
    </Container>
  );
};

export default NotFound;
