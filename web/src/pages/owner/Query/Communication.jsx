import React from 'react';
import { Box, Card, CardContent, FormControl, Select, Typography, Tabs, Tab, TextField, Button, Grid, List, ListItem, ListItemText, IconButton,
  Chip,
  MenuItem,
  InputLabel,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import BugReportIcon from '@mui/icons-material/BugReport';
import useCommunication from '../../../hooks/owner/useCommunication';

const CommunicationSupport = () => {
  const {
    tabIndex,
    setTabIndex,
    title,
    setTitle,
    notification,
    setNotification,
    receiver,
    handleReceiverChange,
    admins,
    anchors,
    customers,
    complaints,
    tickets,
    handleSendNotification
  } = useCommunication();

  return (
    <Card sx={{ m: 3, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        💬 Communication & Support
      </Typography>

      <Tabs value={tabIndex} onChange={(_, val) => setTabIndex(val)} sx={{ mb: 2 }}>
        <Tab label="Send Notifications" />
        {/* <Tab label="Escalated Complaints" />
        <Tab label="Support Tickets" /> */}
      </Tabs>

      {tabIndex === 0 && (
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Send notification to:
          </Typography>
          <FormControl sx={{ minWidth: 200, my: '20px' }}>
            <InputLabel>Filter by Admin</InputLabel>
            <Select 
              value={receiver.admin}
              label="Filter by Admin"
              onChange={(e) => handleReceiverChange('admin', e.target.value)}
            >
              <MenuItem value="All Admins">All Admins</MenuItem>
              {admins.map(admin => (
                <MenuItem key={admin.id} value={admin.code}>{admin.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200, px: '10px', my: '20px' }}>
            <InputLabel>Filter by Anchor</InputLabel>
            <Select 
              value={receiver.anchor}
              label="Filter by Anchor"
              onChange={(e) => handleReceiverChange('anchor', e.target.value)}
            >
              <MenuItem value="All Anchors">All Anchors</MenuItem>
              {anchors.map(anchor => (
                <MenuItem key={anchor.id} value={anchor.code}>{anchor.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200, my: '20px' }}>
            <InputLabel>Filter by Customer</InputLabel>
            <Select 
              value={receiver.customer}
              label="Filter by Customer"
              onChange={(e) => handleReceiverChange('customer', e.target.value)}
            >
              <MenuItem value="All Customers">All Customers</MenuItem>
              {customers.map(customer => (
                <MenuItem key={customer.id} value={customer.code}>{customer.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            label="Enter message title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mt: 2, mb: 2 }}
          />

          <TextField
            label="Enter your message"
            fullWidth
            multiline
            minRows={3}
            value={notification}
            onChange={(e) => setNotification(e.target.value)}
            sx={{ mt: 2, mb: 2 }}
          />

          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleSendNotification}
          >
            Send Notification
          </Button>
        </Box>
      )}

      {tabIndex === 1 && (
        <List>
          {complaints.map((c) => (
            <ListItem
              key={c.id}
              secondaryAction={
                <IconButton edge="end" title="Resolve">
                  <CheckCircleIcon color="success" />
                </IconButton>
              }
            >
              <ListItemText
                primary={`${c.user}: ${c.issue}`}
                secondary={
                  <Chip
                    label={c.status}
                    color={c.status === 'Escalated' ? 'error' : 'warning'}
                    size="small"
                  />
                }
              />
            </ListItem>
          ))}
        </List>
      )}

      {tabIndex === 2 && (
        <Grid container spacing={2}>
          {tickets.map((ticket) => (
            <Grid item xs={12} md={6} key={ticket.id}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1">
                    🎟️ Ticket #{ticket.id}
                  </Typography>
                  <Typography>
                    <strong>User:</strong> {ticket.user}
                  </Typography>
                  <Typography>
                    <strong>Topic:</strong> {ticket.topic}
                  </Typography>
                  <Chip
                    label={ticket.status}
                    color={ticket.status === 'Open' ? 'primary' : 'success'}
                    size="small"
                    sx={{ mt: 1 }}
                    icon={
                      ticket.status === 'Open' ? (
                        <ChatBubbleOutlineIcon fontSize="small" />
                      ) : (
                        <BugReportIcon fontSize="small" />
                      )
                    }
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Card>
  );
};

export default CommunicationSupport;