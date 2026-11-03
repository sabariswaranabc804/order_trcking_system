import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  useTheme,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import axios from 'axios';
import API_URL from '../../config';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import UserNavbar from '../user/Home/UserNavbar';
import { useAuth } from '../../context/AuthContext';

const NotificationPage = () => {
  const theme = useTheme();
  const [user, setUser] = useState(null);
  const [userTypeId, setUserTypeId] = useState(null);
  const navigate = useNavigate();
  const { user: userdetails } = useAuth();
  const userID = userdetails?.user_code;
  const [notifications, setNotifications] = useState([]);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (userID) {
          const response = await fetch(`${API_URL}/api/users/${userID}`);
          if (!response.ok) throw new Error('User not found');
          const data = await response.json();
          setUser(data);
        } else {
          navigate('/login');
        }
      } catch (error) {
        //   console.error('Failed to fetch user data:', error);

        navigate('/login');
      }
    };

    fetchUserProfile();
  }, [userID, navigate]);
  /* console.log(user) */

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v2/superadmin/notifications`, { params: { typeId: user.user_Type_ID, user: user.user_Code } })
      /* console.log(response.data.data); */
      if (response.data.success) {
        const formattedData = response.data.data.map((item) => ({
          id: item.id,
          title: item.title,
          message: item.notification_msg,
          createdAt: item.created_at
        }))
        setNotifications(formattedData);
      } else {
        /* console.log('Failed to fetch notifications', response) */
      }
    } catch (error) {
      /* console.error('Error while fetching notifications', error); */
    }
  }
  useEffect(() => {
    if (user) {
      fetchNotifications();
      setUserTypeId(user.user_Type_ID);
    }
  }, [user])


  const handleDelete = async (id) => {
    //setNotifications(notifications.filter((item) => item.id !== id));
    try {
      await axios.delete(`${API_URL}/api/v2/superadmin/notifications/${id}`);
      await fetchNotifications();
      /* console.log('Notification deleted successfully') */
    } catch (error) {
      /* console.error('Error deleting notification', error); */
    }
  };

  return (
    <>
      {(userTypeId === 5) ? <UserNavbar /> : null}
      <Box sx={{
        bgcolor: theme.palette.background.default,
        minHeight: '100vh',
        py: 4
      }}>
        <Box sx={{ maxWidth: 900, margin: 'auto', px: 3 }}>
          {/* Header Section */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 1
              }}
            >
              <NotificationsIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />
              Notifications
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, ml: 5 }}>
              {notifications.length > 0
                ? `${notifications.length} notification${notifications.length > 1 ? 's' : ''}`
                : 'No new notifications'}
            </Typography>
          </Box>

          {/* Notifications List */}
          <Paper
            elevation={0}
            sx={{
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            {notifications.length === 0 ? (
              <Box sx={{
                p: 8,
                textAlign: 'center'
              }}>
                <NotificationsNoneIcon
                  sx={{
                    fontSize: 80,
                    color: theme.palette.text.disabled,
                    mb: 2
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    mb: 1,
                    color: theme.palette.text.primary,
                    fontWeight: 500
                  }}
                >
                  No notifications yet
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary
                  }}
                >
                  You're all caught up! Check back later for updates.
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {notifications.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        py: 2.5,
                        px: 3,
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          bgcolor: theme.palette.action.hover,
                        }
                      }}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() => handleDelete(item.id)}
                          sx={{
                            color: theme.palette.error.main,
                            '&:hover': {
                              bgcolor: theme.palette.mode === 'dark'
                                ? 'rgba(244, 67, 54, 0.15)'
                                : 'rgba(244, 67, 54, 0.08)'
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <Box sx={{
                        mr: 2,
                        mt: 0.5,
                        p: 1,
                        borderRadius: '50%',
                        bgcolor: theme.palette.mode === 'dark'
                          ? 'rgba(122, 215, 204, 0.15)'
                          : 'rgba(65, 179, 163, 0.1)'
                      }}>
                        <NotificationsActiveIcon
                          sx={{
                            fontSize: 24,
                            color: theme.palette.primary.main
                          }}
                        />
                      </Box>
                      <ListItemText
                        primary={
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 600,
                              color: theme.palette.text.primary,
                              mb: 0.5
                            }}
                          >
                            {item.title}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{
                                color: theme.palette.text.secondary,
                                mb: 1,
                                lineHeight: 1.6
                              }}
                            >
                              {item.message}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <AccessTimeIcon
                                sx={{
                                  fontSize: 14,
                                  color: theme.palette.text.disabled
                                }}
                              />
                              <Typography
                                variant="caption"
                                sx={{ color: theme.palette.text.disabled }}
                              >
                                {dayjs(item.createdAt.replace('Z', '')).format('DD MMM YYYY, hh:mm A')}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < notifications.length - 1 && (
                      <Divider sx={{ borderColor: theme.palette.divider }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default NotificationPage;