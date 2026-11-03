import React, { useState,useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';
import  API_URL  from '../../config';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; 
import dayjs from 'dayjs';


const AdminNotificationPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const{user:userDetails}=useAuth();

  const userID = userDetails?.user_code;  // Get userID from Redux store
  const [notifications,setNotifications]=useState([]);

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

  const fetchNotifications=async()=>{
    try{
      const response = await axios.get(`${API_URL}/api/v2/superadmin/notifications`,{params: { type:'admin' , user: user.user_Code}})
      /* console.log(response.data.data); */
      if(response.data.success){
        const formattedData= response.data.data.map((item)=>({
          id:item.id,
          title:item.title,
          message:item.notification_msg,
          createdAt:item.created_at
        }))
        setNotifications(formattedData);
      }else{
      /* console.log('Failed to fetch notifications',response) */
     }
    }catch(error){
    //  console.error('Error while fetching notifications',error);
    }
  }
  useEffect(()=>{
    if(user){
      fetchNotifications();
    }
  },[user])
  

  const handleDelete = async(id) => {
    //setNotifications(notifications.filter((item) => item.id !== id));
    try{
      await axios.delete(`${API_URL}/api/v2/superadmin/notifications/${id}`);
      await fetchNotifications();
      /* console.log('Notification deleted successfully') */
    }catch(error){
    //  console.error('Error deleting notification',error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">
        <NotificationsIcon sx={{ mr: 1 }} />
        Admin Notifications
      </Typography>

      <Paper elevation={3} sx={{ mt: 2 }}>
        <List>
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText primary="No notifications available." />
            </ListItem>
          ) : (
            notifications.map((item) => (
                <>
                <ListItem alignItems="flex-start" key={item.id}>
                  <ListItemText
                    primary={<strong>{item.title}</strong>}
                    secondary={
                      <>
                        {item.message}
                        <br />
                        <Typography variant="caption" color="text.secondary">
                         {dayjs(item.createdAt.replace('Z', '')).format('DD MMM YYYY, hh:mm A')}
                        </Typography>
                      </>
                    }
                  />
                    <IconButton edge="end" onClick={() => handleDelete(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  
                </ListItem>
                <Divider/>
                </>

            ))
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default AdminNotificationPage;