import React from 'react';
import { Paper, Box, Typography } from '@mui/material';

const Card = ({ icon, title, value }) => {
  return (
    <Paper 
      elevation={3}
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        bgcolor: 'background.paper',
        '&:hover': {
          boxShadow: 6,
          transform: 'scale(1.02)',
          transition: 'all 0.3s ease-in-out'
        }
      }}
    >
      <Box sx={{ fontSize: '2rem', color: 'text.secondary' }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography variant="h5">
          {value}
        </Typography>
      </Box>
    </Paper>
  );
};

export default Card;