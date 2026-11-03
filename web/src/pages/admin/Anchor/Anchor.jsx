import React, { useRef } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Button, Box, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import Swal from 'sweetalert2';
import useAnchorManagement from '../../../hooks/admin/useAnchorManagement';

// Table columns configuration
const getColumns = (handleDelete, handleEdit) => [
  { field: "sno", headerName: 'S.No', width: 100 },
  { field: 'deliveryman_name', headerName: 'Name', width: 200, sortable: true },
  { field: 'contact', headerName: 'Phone Number', width: 200, sortable: true },
  { field: 'alternativeNumber', headerName: 'Alternative Number', width: 200, sortable: true },
  { field: 'email', headerName: 'Email', width: 250, sortable: true },
  { field: 'city', headerName: 'City', width: 150, sortable: true },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 200,
    renderCell: (params) => (
      <div>
        <IconButton color="info" onClick={() => handleEdit(params.row)}>
          <Edit />
        </IconButton>
        <IconButton
          sx={{ color: "red" }}
          onClick={() => {
            Swal.fire({
              title: 'Are you sure?',
              text: "You won't be able to revert this!",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
              if (result.isConfirmed) {
                handleDelete(params.row.deliveryman_id);
                Swal.fire(
                  'Deleted!',
                  'The record has been deleted.',
                  'success'
                );
              }
            });
          }}
        >
          <Delete />
        </IconButton>
      </div>
    ),
    sortable: false,
  },
];

// Main Component
const Anchor = () => {
  const {
    rows,
    dialogOpen,
    isEditing,
    formData,
    handleInputChange,
    openCreateDialog,
    closeDialog,
    handleEdit,
    handleDelete,
    handleSaveAnchor
  } = useAnchorManagement();
  
  const componentRef = useRef();
  const columns = getColumns(handleDelete, handleEdit);
  
  return (
    <Box sx={{ height: '100vh', width: '100%', p: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        {/* New User Button */}
        <Button
          variant="contained"
          style={{ marginBottom: '20px' }}
          onClick={openCreateDialog}
        >
          Add New Anchor
        </Button>
      </Box>

      {/* Table */}
      <div ref={componentRef}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableSelectionOnClick
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20, 50]}
          sortingOrder={['asc', 'desc']}
          getRowId={(row) => row.deliveryman_id}
        />
      </div>

      {/* Dialog Form */}
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>{isEditing ? 'Edit User' : 'New User'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleInputChange}
          />
          <TextField
            label="Phone Number"
            name="phoneNumber"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />
          <TextField
            label="Alternative Phone Number"
            name="alternativePhoneNumber"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.alternativePhoneNumber}
            onChange={handleInputChange}
          />
          <TextField
            label="Email"
            name="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleInputChange}
          />
          <TextField
            label="Address"
            name="address"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.address}
            onChange={handleInputChange}
          />
          <TextField
            label="City"
            name="city"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.city}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="warning">
            Cancel
          </Button>
          <Button onClick={handleSaveAnchor} color="info">
            Save Anchor
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Anchor;