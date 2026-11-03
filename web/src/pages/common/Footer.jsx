import React from 'react';
import { Box, Container, Typography, IconButton, Link } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(10px)',
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {/* <Typography variant="body2" align="center">
            © {currentYear} made with 💗 by Akilam Technology for a better web Application. <a href='https://www.akilamtechnology.com/OurProducts' style={{color:"pink"}} >View Site</a>
          </Typography> */}
          
          {/* <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              component={Link}
              href="https://facebook.com"
              target="_blank"
              sx={{ color: 'white' }}
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              component={Link}
              href="https://twitter.com"
              target="_blank"
              sx={{ color: 'white' }}
            >
              <TwitterIcon />
            </IconButton>
            <IconButton
              component={Link}
              href="https://instagram.com"
              target="_blank"
              sx={{ color: 'white' }}
            >
              <InstagramIcon />
            </IconButton>
            <IconButton
              component={Link}
              href="https://linkedin.com"
              target="_blank"
              sx={{ color: 'white' }}
            >
              <LinkedInIcon />
            </IconButton>
          </Box> */}
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;