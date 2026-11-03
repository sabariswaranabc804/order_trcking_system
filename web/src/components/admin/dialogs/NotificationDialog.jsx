import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Popover,
  Badge,
  IconButton
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

const NotificationDialog = ({
  rejectorder,
  anchorEl,
  dialogOpen,
  selectedNotification,
  handleIconClick,
  handlePopoverClose,
  handleNotificationClick,
  handleDialogClose
}) => {
  return (
    <>
      {/* Notification Icon with Badge */}
      <IconButton color="primary" onClick={handleIconClick} style={{ marginLeft: '8px' }}>
        <Badge badgeContent={rejectorder.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {/* Popover for Notifications */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <List style={{ width: '250px' }}>
          {rejectorder.map((notification) => (
            <ListItem button key={notification.id} onClick={() => handleNotificationClick(notification)}>
              <ListItemText primary={`Order Id ${notification.order_id} Rejected by ${notification.deliveryman_name}`} />
            </ListItem>
          ))}
        </List>
      </Popover>

      {/* Dialog for Notification Details */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Notification Details</DialogTitle>
        <DialogContent dividers>
          <Typography>{selectedNotification?.deliveryman_name}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NotificationDialog;