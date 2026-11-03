import React from 'react';
import { Card, CardContent, Typography, IconButton, Grid, Box, TextField, CardMedia, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import API_URL from '../../../config';
import useServiceManagement from '../../../hooks/admin/useServiceManagement';

const ServicesPage = () => {
  const {
    services,
    open,
    newService,
    imagePreview,
    editMode,
    handleClickOpen,
    handleClose,
    handleInputChange,
    handleImageUpload,
    handleSubmit,
    handleEdit,
    handleDelete,
    setImagePreview,
    setServiceImage
  } = useServiceManagement();

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Services
      </Typography>

      <Grid container spacing={2}>
        {/* Add New Service Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card style={{ textAlign: 'center', padding: '20px' }}>
            <CardContent>
              <IconButton sx={{color:"green"}} onClick={handleClickOpen}>
                <AddIcon fontSize="large" />
              </IconButton>
              <Typography variant="body1">Create New Service</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Render the services added */}
        {services.map((service, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              {service.imagefile && (
                <CardMedia
                  component="img"
                  sx={{ width: '100%', height: '150px', objectFit: 'cover' }}
                  image={`${API_URL}/uploads/product-images/${service.imagefile}`}
                  alt={service.serv_Name}
                />
              )}
              <CardContent>
                {/* Flexbox container */}
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="h6">{service.serv_Name}</Typography>
                  <Box>
                    <IconButton color='info' onClick={() => handleEdit(service)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton sx={{ color: "red" }} onClick={() => handleDelete(service.serv_Id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="body2">Description: {service.serv_Description}</Typography>
                <Typography variant="body2">Service Code: {service.serv_Code}</Typography>
                <Typography variant="body2">Created On: {new Date(service.created_On).toLocaleDateString()}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? 'Edit Service' : 'Create New Service'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="serviceName"
            label="Service Name"
            type="text"
            fullWidth
            value={newService.serviceName}
            onChange={handleInputChange}
          />
          
          <TextField
            margin="dense"
            name="serv_Description"
            label="Description"
            type="text"
            fullWidth
            value={newService.serv_Description}
            onChange={handleInputChange}
          />
          
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Upload Image
            <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
          </Button>
          
          {/* Image Preview */}
          {imagePreview && (
            <Box sx={{ marginTop: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2" gutterBottom>
                Image Preview:
              </Typography>
              <Box
                component="img"
                src={imagePreview}
                alt="Service preview"
                sx={{
                  width: '100%',
                  maxWidth: '300px',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: 1,
                  border: '1px solid #ddd'
                }}
              />
              <Box sx={{ marginTop: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setImagePreview(null);
                    setServiceImage(null);
                  }}
                >
                  Remove Image
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {editMode ? 'Update' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ServicesPage;