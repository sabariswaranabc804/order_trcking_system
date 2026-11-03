import { useState } from 'react';

export const useNotifications = (rejectorder) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  
  // Handle notification icon click to open popover
  const handleIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  // Handle closing the popover
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  
  // Handle clicking on a notification
  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setDialogOpen(true);
    handlePopoverClose();
  };
  
  // Handle closing the notification dialog
  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedNotification(null);
  };
  
  return {
    anchorEl,
    dialogOpen,
    selectedNotification,
    handleIconClick,
    handlePopoverClose,
    handleNotificationClick,
    handleDialogClose
  };
};