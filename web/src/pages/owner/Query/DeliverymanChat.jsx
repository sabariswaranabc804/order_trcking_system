import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar, Divider, Paper, TextField, IconButton, Tabs, Tab, useTheme, Drawer, Badge, Chip } from '@mui/material';
import { Search, Menu, Close, Chat, Person, AdminPanelSettings, LocalShipping } from '@mui/icons-material';
import ChatBox from './ChatBox';
import { useAuth } from '../../../context/AuthContext';
import useDeliverymanChat from '../../../hooks/owner/useDeliverymanChat';

const DeliverymanChat = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const usertype_owner = user?.userType;
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Get the current user's ID and role from localStorage
  const currentUserId = localStorage.getItem('userID') || '1';
  const currentUserRole = localStorage.getItem('user_type') || '1';
  
  const {
    selectedUser,
    setSelectedUser,
    searchQuery,
    setSearchQuery,
    loading,
    userType,
    handleTabChange,
    filteredUsers,
    getUserId,
    getUserRole,
    getUserName,
    getUserContact
  } = useDeliverymanChat(currentUserId, currentUserRole);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setMobileOpen(false); // Close drawer on mobile after selection
  };

  const getUserIcon = (type) => {
    switch(type) {
      case 'admin': return <AdminPanelSettings />;
      case 'deliveryman': return <LocalShipping />;
      case 'customer': return <Person />;
      case 'owner': return <Person />;
      default: return <Person />;
    }
  };

  const userListContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      {/* Header */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 2, 
          borderRadius: 0,
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: 'primary.main',
          color: 'primary.contrastText'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chat />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Messages</Typography>
          </Box>
          <IconButton 
            sx={{ display: { sm: 'none' }, color: 'inherit' }}
            onClick={handleDrawerToggle}
          >
            <Close />
          </IconButton>
        </Box>
        
        {/* User type tabs */}
        <Tabs 
          value={userType} 
          onChange={handleTabChange} 
          variant="fullWidth"
          sx={{ 
            mb: 2,
            '& .MuiTab-root': {
              color: 'primary.contrastText',
              opacity: 0.7,
              minHeight: 40,
              textTransform: 'none',
              fontSize: '0.875rem',
              '&.Mui-selected': {
                color: 'primary.contrastText',
                opacity: 1,
              }
            },
            '& .MuiTabs-indicator': {
              bgcolor: 'primary.contrastText',
            }
          }}
        >
          <Tab value="admin" label="Admin" icon={<AdminPanelSettings sx={{ fontSize: 18 }} />} iconPosition="start" />
          <Tab value="deliveryman" label="Delivery" icon={<LocalShipping sx={{ fontSize: 18 }} />} iconPosition="start" />
          {usertype_owner==1 ? 
            <Tab value="customer" label="Customer" icon={<Person sx={{ fontSize: 18 }} />} iconPosition="start" /> :
            <Tab value="owner" label="Owner" icon={<Person sx={{ fontSize: 18 }} />} iconPosition="start" />
          }
        </Tabs>
        
        {/* Search box */}
        <TextField
          fullWidth
          size="small"
          placeholder={`Search ${userType}s...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'background.paper',
              borderRadius: 3,
              '& fieldset': {
                borderColor: 'transparent',
              },
              '&:hover fieldset': {
                borderColor: 'transparent',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.light',
              }
            }
          }}
        />
      </Paper>
      
      {/* Users list */}
      <List 
        sx={{ 
          overflow: 'auto', 
          flex: 1,
          p: 0,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: theme.palette.action.disabled,
            borderRadius: '4px',
            '&:hover': {
              bgcolor: theme.palette.action.active,
            },
          },
        }}
      >
        {loading ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">Loading...</Typography>
          </Box>
        ) : filteredUsers.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Person sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography color="text.secondary">No {userType}s found</Typography>
          </Box>
        ) : (
          filteredUsers.map((user) => (
            <React.Fragment key={getUserId(user)}>
              <ListItem 
                button 
                onClick={() => handleUserSelect(user)}
                selected={selectedUser && getUserId(selectedUser) === getUserId(user)}
                sx={{ 
                  py: 1.5,
                  px: 2,
                  '&.Mui-selected': { 
                    bgcolor: 'action.selected',
                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                  },
                  '&:hover': { 
                    bgcolor: 'action.hover',
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    sx={{
                      '& .MuiBadge-badge': {
                        bgcolor: 'success.main',
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        border: `2px solid ${theme.palette.background.paper}`,
                      }
                    }}
                  >
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {getUserName(user).charAt(0) || userType.charAt(0).toUpperCase()}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText 
                  primary={
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {getUserName(user)}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {getUserContact(user)}
                    </Typography>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      height: { xs: 'calc(100vh - 64px)', sm: 'calc(100vh - 100px)' },
      bgcolor: 'background.default',
      position: 'relative'
    }}>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            width: 280,
            boxSizing: 'border-box',
          },
        }}
      >
        {userListContent}
      </Drawer>

      {/* Desktop sidebar */}
      <Paper 
        elevation={0}
        sx={{ 
          width: { xs: 0, sm: 320, md: 360 },
          display: { xs: 'none', sm: 'flex' },
          height: '100%', 
          borderRadius: 0,
          borderRight: `1px solid ${theme.palette.divider}`,
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {userListContent}
      </Paper>
      
      {/* Right side - Chat area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
        {selectedUser ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Chat header */}
            <Paper
              elevation={0}
              sx={{ 
                p: 2, 
                borderBottom: `1px solid ${theme.palette.divider}`,
                display: 'flex', 
                alignItems: 'center',
                bgcolor: 'background.paper',
                zIndex: 1
              }}
            >
              <IconButton 
                sx={{ display: { sm: 'none' }, mr: 1 }}
                onClick={handleDrawerToggle}
              >
                <Menu />
              </IconButton>
              <Avatar 
                sx={{ 
                  mr: 2,
                  bgcolor: 'primary.main',
                  width: { xs: 40, sm: 48 },
                  height: { xs: 40, sm: 48 }
                }}
              >
                {getUserName(selectedUser).charAt(0) || userType.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {getUserName(selectedUser)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip 
                    label={userType}
                    size="small"
                    icon={getUserIcon(userType)}
                    sx={{ 
                      height: 20,
                      fontSize: '0.7rem',
                      '& .MuiChip-icon': {
                        fontSize: 14
                      }
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {getUserContact(selectedUser)}
                  </Typography>
                </Box>
              </Box>
            </Paper>
            
            {/* Chat content */}
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              <ChatBox 
                senderId={currentUserId} 
                receiverId={getUserId(selectedUser)} 
                senderRole={currentUserRole} 
                receiverRole={getUserRole()} 
              />
            </Box>
          </Box>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            bgcolor: 'background.default',
            p: 3,
            textAlign: 'center'
          }}>
            <IconButton 
              sx={{ 
                display: { sm: 'none' },
                position: 'absolute',
                top: 16,
                left: 16
              }}
              onClick={handleDrawerToggle}
            >
              <Menu />
            </IconButton>
            <Chat sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Select a conversation
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Choose a {userType} from the list to start chatting
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DeliverymanChat;