import React from 'react';
import { Avatar, Container, Typography, Grid } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { useAuth } from '../../../context/AuthContext';
import { useProfile } from '../../../hooks/admin/useProfile';

function AdminProfilePage() {
  const { user: userDetails } = useAuth();
  const userID = userDetails?.user_code;
  
  // Use our custom hook
  const { user, handleCardClick, handleLogout } = useProfile(userID);

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Grid container spacing={3} alignItems="center" justifyContent="center" style={{ marginTop: 20 }}>
        <Grid item xs={12} sm={4}>
          <Avatar alt="" src="https://img.freepik.com/free-photo/view-3d-businessman_23-2150709828.jpg?w=740&t=st=1729161369~exp=1729161969~hmac=47188f3a919bafde6b37e2292c1a1d206ac7da4f836f439c994844022c519be5" style={{ width: 150, height: 150, margin: '0 auto' }} />
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography variant="h5">{user.user_Name}</Typography>
          <Typography variant="body1">{user.alternativephoneNumber}</Typography>
          <Typography variant="body1">
            <PhoneIcon sx={{ mr: 1, color: "rgba(17, 125, 247, 0.8)" }} /> Phone Number:<span style={{ fontWeight: "bold" }}>{user.mobile_Number}</span>
          </Typography>
          <Typography variant="body1">
            <EmailIcon sx={{ mr: 1, color: "rgba(17, 125, 247, 0.8)" }} /> Email: <span style={{ fontWeight: "bold" }}>{user.email_ID}</span>
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AdminProfilePage;
