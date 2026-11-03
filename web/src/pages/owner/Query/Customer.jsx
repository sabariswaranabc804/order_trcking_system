import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  IconButton,
  Tabs,
  Tab,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import FeedbackIcon from '@mui/icons-material/Feedback';
import useCustomerOverview from '../../../hooks/owner/useCustomerOverview';

const CustomerOverview = () => {
  const {
    tab,
    setTab,
    dialogOpen,
    selectedFeedback,
    feedback,
    customers,
    handleOpenFeedback,
    handleCloseFeedback,
    handleBlacklist,
    renderStatusChip
  } = useCustomerOverview();

  return (
    <Card sx={{ m: 3, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        👥 Customer Overview
      </Typography>

      <Tabs value={tab} onChange={(_, val) => setTab(val)} sx={{ mb: 2 }}>
        {/* <Tab label="All Customers" /> */}
        <Tab label="Feedback" />
      </Tabs>

      <Box>
        {tab === 1 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={renderStatusChip(customer.status).label} 
                      color={renderStatusChip(customer.status).color} 
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      color="error" 
                      title="Blacklist"
                      onClick={() => handleBlacklist(customer.id)}
                    >
                      <BlockIcon />
                    </IconButton>
                    <IconButton
                      color="primary"
                      title="View Feedback"
                      onClick={() => handleOpenFeedback(customer.feedback)}
                    >
                      <FeedbackIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {tab === 0 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Ratings</TableCell>
                <TableCell>Feedback</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feedback.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.userName}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>
                    <Chip label={`${item.ratings} ⭐`} color="primary" />
                  </TableCell>
                  <TableCell>
                    {item.feedback}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>

      {/* Feedback Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseFeedback}>
        <DialogTitle>Customer Feedback</DialogTitle>
        <DialogContent>
          <Typography>{selectedFeedback}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFeedback}>Close</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default CustomerOverview;