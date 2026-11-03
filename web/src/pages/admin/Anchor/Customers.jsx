import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress,
  Container, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid
} from '@mui/material';
import useCustomerTable from '../../../hooks/admin/useCustomerTable';

const CustomerTable = () => {
  const {
    users,
    loading,
    error,
    open,
    newCustomer,
    handleOpen,
    handleClose,
    handleChange,
    handleSubmit
  } = useCustomerTable();

  if (loading) return <CircularProgress />;
  if (error) return <Container><Typography color="error">{error}</Typography></Container>;

  return (
    <Container style={{ padding: "30px" }}>
      <Typography variant="h6">Customer Details</Typography>
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ marginBottom: 2 }}>
        Add Customer
      </Button>

      {/* Add Customer Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Customer</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{mt:1}}>
            {["name", "phoneNumber", "email", "alternativePhoneNumber" ].map((field) => (
              <Grid item xs={12} sm={6} key={field}>
                <TextField 
                  label={field.charAt(0).toUpperCase() + field.slice(1)} 
                  fullWidth name={field} value={newCustomer[field]} 
                  onChange={handleChange} 
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleSubmit} color="primary">Submit</Button>
        </DialogActions>
      </Dialog>

      {/* Customer Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table sx={{ minWidth: 650, }} aria-label="user table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>User ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Alternative Mobile</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.user_Name}</TableCell>
                <TableCell>{user.email_ID}</TableCell>
                <TableCell>{user.mobile_Number}</TableCell>
                <TableCell>{user.alter_Mobile_number}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default CustomerTable;