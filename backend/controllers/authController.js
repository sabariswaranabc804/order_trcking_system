const User = require('../models/User');
const { generateOtp, sendOtpEmail } = require('../utils/otp-utils');
const { generateToken } = require('../utils/jwt-utils');
const {sql,poolPromise}=require("../db")
const authController = {
  // Register a new user
  register: async (req, res) => {
    try {
      const { name, email, dob, mobile } = req.body;
       console.log(req.body);
       
      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email already registered' 
        });
      }
      
      // Generate OTP
     // const otp = generateOtp();
      const otp = '123456';
      // Create user
      const user = await User.create({
        user_Name: name,
        user_Email: email,
        dob,
        mobileNumber:mobile,
        otp
      });
      
      // Send OTP
      await sendOtpEmail(email, otp);
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully. OTP sent to email.',
        user
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server error during registration' 
      });
    }
  },
  
  // Send OTP for login
  sendOtp: async (req, res) => {
    try {
      const { email } = req.body;
      console.log("email",email);
      // Check if user exists
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }
      
      // Generate OTP
      // const otp = generateOtp();
      const otp = '123456';
      
      // Update user's OTP
      await User.updateOtp(email, otp);
      
      // Send OTP
      await sendOtpEmail(email, otp);
      
      res.status(200).json({
        success: true,
        message: 'OTP sent successfully'
      });
    } catch (error) {
      console.error('Send OTP error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server error while sending OTP' 
      });
    }
  },
  
  // Verify OTP and login
  verifyOtp: async (req, res) => {
    try {
      const { email, otp } = req.body;
      
      // Verify OTP
      const user = await User.verifyOtp(email, otp);
      if (!user) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid OTP' 
        });
      }
      console.log("user",user);
      
      // Generate JWT token
      const token = generateToken(user);
      
      // Set token in HTTP-only cookie
      res.cookie('ots_auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure in production
        sameSite: 'strict',
         maxAge: 24 * 60 * 60 * 1000 // 24 hours
       // maxAge: 2 * 60 * 1000 // 2 minutes in milliseconds
      });
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        user: {
          user_type:user.user_Type_ID, // Send the user_type to the frontend
          userID:user.user_Code,
          company_Id:user.company_Id,
          deliveryman_id:user.deliveryman_id
        }
      });
    } catch (error) {
      console.error('Verify OTP error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server error during verification' 
      });
    }
  },

  // Get current user
  getCurrentUser: async (req, res) => {
    try {
      // The user should be attached to req by the auth middleware
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authenticated'
        });
      }
      console.log('log',req.user);
      
      // Get fresh user data from database
      const user = await User.findByEmail(req.user.email);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      res.status(200).json({
        success: true,
        user: {
          user_code: user.user_Code,
          name: user.user_Name,
          email: user.email_ID,
          userType: user.user_Type_ID,
          company_Id:user.company_Id,
          deliveryman_id:user.deliveryman_id
        }
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  },
  
  // Logout
  logout: (req, res) => {
    // Set an expired cookie to force removal
    res.cookie('ots_auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      expires: new Date(0) // Set expiration to the past
    });
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  },
  //anchors getAllAnchors
  getAllAnchors: async (req, res) => {
    try {
      const query = `
      SELECT * 
      FROM user_Master 
      WHERE userType_Id = '3' and active_Flag=1
      `;

      const result = await sql.query(query);
      return res.status(200).json({
        success: true,
        data: result.recordset
      });
    } catch (error) {
      console.error('Error fetching anchors:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch anchors',
        error: error.message
      });
    }
  },
  //getUserSummary
  getUserSummary: async (req, res) => {
    try {
      const users = await User.getUserBookingSummary();
  
      // Optional: parse bookingsJson
      const formatted = users.map(user => ({
        id: user.id,
        name: user.name,
        phone: user.phone,
        status: user.status,
        Bookings: user.Bookings.toString(),
        bookings: JSON.parse(user.bookingsJson)
      }));
  
      res.json(formatted);
    } catch (err) {
      console.error('Error in controller:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
,
   userCounts: async (req, res) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(`
        SELECT user_Type_ID, COUNT(*) as count
        FROM user_Master
        GROUP BY user_Type_ID
      `);
      res.status(200).json({
        success: true,
        data: result.recordset
      });
    } catch (err) {
      console.error('Error in controller:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = authController;