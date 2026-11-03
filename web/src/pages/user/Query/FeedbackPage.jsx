import React, { useState,useEffect } from 'react'
import UserNavbar from '../Home/UserNavbar';
import {Box,Typography,TextField,Card,Button,Rating} from '@mui/material'
//import  feedbackImage from '../../../assets/img/feedbackImage.png';
import axios from 'axios';
import  API_URL  from '../../../config';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../../../context/AuthContext';

function FeedbackPage(){
    const [name,setName] =useState('');
    const [feedback,setFeedback] =useState('');
    const [email,setEmail] = useState('')
    const [value,setValue] = useState(1);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const{user:userDetails}=useAuth();
    /* console.log("userDetails",userDetails); */
    
    const userID =userDetails?.user_code;

    /* console.log("userId",userID); */
    
     useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (userID) {
          const response = await fetch(`${API_URL}/api/users/${userID}`);
          if (!response.ok) throw new Error('User not found');
          const data = await response.json();
          /* console.log("data",data); */
          
          setUser(data);
          setName(data.user_Name)
          setEmail(data.email_ID)
          //navigate('/account');
        } else {
          navigate('/login');
        }
      } catch (error) {
     //   console.error('Failed to fetch user data:', error);
     
        navigate('/login');
      }
    };

    fetchUserProfile();
  }, [userID]);
  /* console.log("user",user) */

    const handleSubmit=async(e)=>{
        e.preventDefault();
        /*alert(`feedback submitted by 
            Name: ${name}
            Email:${email}
            Feedback:${feedback}
            Ratings:${value}`)*/
        try{
            const response = await axios.post(`${API_URL}/api/customer-feedback`,{userCode:user.user_Code,userName:name,email:email,feedback:feedback,ratings:value})
            if(response.data){
                /* console.log('Feedback sent successfully') */
            }else{
                /* console.error('Failed send feedback',response) */
            }
            setFeedback('');
            setValue(1);
            navigate('/account');
        }catch(error){
            /* console.error('Failed send feedback',error) */
        }
    }


    return(
        <>
            <UserNavbar />
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="90vh"
            >
            <Card sx={{ m: 3, p: 3,width:'100%',maxWidth:'500px',alignItems:'center',justifyContent:'center' }}>
                <img src="https://t3.ftcdn.net/jpg/03/76/66/16/360_F_376661672_OUk4ws66zUuVkOsb9hnbC5Mcg1NjrCI6.jpg" style={{width:'100%',height:'200px'}}/>
                <Typography variant="h5" gutterBottom textAlign="center">
                    Submit Feedback
                </Typography>
                <Box> 
                    <TextField
                        label="Your Name"
                        fullWidth
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
                        sx={{mt: 2, mb: 2}}
                        inputProps={{readOnly : true}}
                    />
                    <TextField
                        label="Your Email Id"
                        fullWidth
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        sx={{mt: 2, mb: 2}}
                        inputProps={{readOnly : true}}
                    />

                    <TextField
                        label="Enter your Feedback"
                        fullWidth
                        multiline
                        minRows={3}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        sx={{ mt: 2, mb: 2 }}
                    />
                    <Box display="flex" justifyContent="center" sx={{my:2}}>
                        <Rating
                            name="simple-controlled"
                            value={value}
                            sx={{fontSize:'3rem'}}
                            onChange={(event, newValue) => {
                            setValue(newValue);
                            }}
                        />
                    </Box>
                    <Box display="flex" justifyContent="center">
                        <Button
                            variant="contained"
                            sx={{alignContent:'center',display:'flex',justifyContent:'center'}}
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Card>
            </Box>
        </>
    )
}
export default FeedbackPage;