import React from 'react';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Box
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { Tabs, Tab } from '@mui/material';
import useAdminManagement from '../../../hooks/owner/useAdminManagement';

const AdminManagement = () => {
  const {
    selectedTab,
    openDialog,
    isEditMode,
    admins,
    owners,
    deliverymen,
    customers,
    newUser,
    setNewUser,
    handleTabChange,
    getCurrentData,
    handleOpenDialog,
    handleCloseDialog,
    handleEdit,
    handleUpdate,
    handleAdd,
    handleToggleActive
  } = useAdminManagement();

  const renderFormContent = () => {
    switch(selectedTab) {
      case 0: // Admin Form
      case 1: // Owner Form (same as Admin)
        return (
          <>
            <TextField
              fullWidth
              margin="dense"
              label="Username"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            
            <TextField
              fullWidth
              margin="dense"
              label="Mobile Number"
              value={newUser.mobile}
              onChange={(e) => setNewUser({ ...newUser, mobile: e.target.value })}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
          </>
        );
        case 2: // Customer Form (same as Deliveryman)
        return (
          <>
            <TextField
              fullWidth
              margin="dense"
              label="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Phone Number"
              value={newUser.mobile}
              onChange={(e) => setNewUser({ ...newUser, mobile: e.target.value })}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Alternative Phone Number"
              value={newUser.alternativePhone}
              onChange={(e) => setNewUser({ ...newUser, alternativePhone: e.target.value })}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            {isEditMode ? <></> : <>
              <TextField
                fullWidth
                margin="dense"
                label="Address"
                value={newUser.address}
                onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
              />
              <TextField
                fullWidth
                margin="dense"
                label="City"
                value={newUser.city}
                onChange={(e) => setNewUser({ ...newUser, city: e.target.value })}
              />
            </>}
          </>
        );
      
      case 3: // Deliveryman Form
        return (
          <>
            <TextField
              fullWidth
              margin="dense"
              label="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Phone Number"
              value={newUser.mobile}
              onChange={(e) => setNewUser({ ...newUser, mobile: e.target.value })}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Alternative Phone Number"
              value={newUser.alternativePhone}
              onChange={(e) => setNewUser({ ...newUser, alternativePhone: e.target.value })}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
          </>
        );
      
      default:
        return null;
    }
  };

  const { data, title } = getCurrentData();
  const totalLoggedIn = admins.length + owners.length + deliverymen.length + customers.length;
  
  return (
    <Box sx={{mt:3}}>
      <Typography variant="h5">Account Holders-({totalLoggedIn})</Typography> <br />
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label={`Owner(${owners.length})`} />
          <Tab label={`Admin(${admins.length})`} />
          <Tab label={`DeliveryMen(${deliverymen.length})`} />
          <Tab label={`Customer(${customers.length})`} />
        </Tabs>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">{title} Management</Typography>
        <Button variant="contained" onClick={handleOpenDialog}>
          Create {title}
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{title} Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Mobile</TableCell>
            <TableCell>AlterNative Number</TableCell>
            <TableCell>Created_Date</TableCell>
            <TableCell>isActive</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(item => (
            <TableRow key={item.id}>
              <TableCell>{item.name || "null"}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.mobile || "null"}</TableCell>
              <TableCell>{item.alter_Mobile_number || "null"}</TableCell>
              <TableCell>
                {item.created_Date
                  ? new Date(item.created_Date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : "null"}
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={item.isActive}
                  onChange={() => handleToggleActive(item.id, item.isActive)}
                />
              </TableCell>
              <TableCell align="right">
                <IconButton color="primary" onClick={() => handleEdit(item)}>
                  <Edit />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isEditMode ? `Edit ${title}` : `Create New ${title}`}</DialogTitle>
        <DialogContent>
          {renderFormContent()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            CANCEL
          </Button>
          <Button 
            variant="contained" 
            onClick={isEditMode ? handleUpdate : handleAdd}
            sx={{ bgcolor: '#00A1E0' }}
          >
            {isEditMode ? 'UPDATE' : 'SUBMIT'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminManagement;