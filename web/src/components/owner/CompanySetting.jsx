import React from 'react';
import {
  Box, Button, Card, CardContent, Grid, TextField, Typography, Alert
} from '@mui/material';
import API_URL from '../../config';

function CompanySetting({
  companyData,
  handleInputChange,
  logoPreview,
  handleLogoChange,
  frontPagePreview,
  handleFrontPageImageChange,
  handleSubmit,
  loading,
  message
}) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>Company Settings</Typography>
        {message.text && (
          <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField fullWidth label="Company Name" name="name" value={companyData.name} onChange={handleInputChange} margin="normal" required />
            </Grid>

            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="subtitle1">Company Logo</Typography>
                <Button variant="outlined" component="label">UPLOAD LOGO
                  <input type="file" hidden accept="image/*" onChange={handleLogoChange} />
                </Button>
                {(logoPreview || companyData.logo) && (
                  <Box mt={2}>
                    <img src={logoPreview || `${API_URL}/uploads/company/logo/${companyData.logo}`} alt="Logo Preview" style={{ maxWidth: 200 }} />
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="subtitle1">Front Page Image</Typography>
                <Button variant="outlined" component="label">UPLOAD IMAGE
                  <input type="file" hidden accept="image/*" onChange={handleFrontPageImageChange} />
                </Button>
                {(frontPagePreview || companyData.frontPageImage) && (
                  <Box mt={2}>
                    <img src={frontPagePreview || `${API_URL}/uploads/company/frontpage/${companyData.frontPageImage}`} alt="Front Page Preview" style={{ maxWidth: 300 }} />
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth multiline rows={4} label="Description" name="description" value={companyData.description} onChange={handleInputChange} margin="normal" />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Email" name="email" value={companyData.email} onChange={handleInputChange} type="email" margin="normal" />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Phone" name="phone" value={companyData.phone} onChange={handleInputChange} margin="normal" />
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth multiline rows={3} label="Address" name="address" value={companyData.address} onChange={handleInputChange} margin="normal" />
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth label="Website" name="website" value={companyData.website} onChange={handleInputChange} margin="normal" />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" disabled={loading} sx={{ mt: 2 }}>
                SAVE COMPANY SETTINGS
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
}

export default CompanySetting;