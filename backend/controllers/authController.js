const otpModel = require('../models/otpModel');
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
      console.log("Request OTP for:", email);

      const user = await User.findByEmailOrMobile(email);
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }
      
      const otp = '333333';
      const targetEmail = user.email_ID || email;
      
      // Update user's OTP in user_Master
      await User.updateOtp(targetEmail, otp);
      
      // Also save in otp_table for backwards compatibility
      const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
      try {
        await otpModel.saveOtp(targetEmail, otp, expiresAt);
      } catch (e) {
        console.warn('saveOtp warning:', e.message);
      }
      
      // Attempt to send email if available
      try {
        await sendOtpEmail(targetEmail, otp);
      } catch (mailErr) {
        console.warn('Mail send skipped:', mailErr.message);
      }
      
      res.status(200).send('OTP has been sent to your email.');
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
      if (!email || !otp) {
        return res.status(400).send('Email/Mobile and OTP are required');
      }
      
      // 1. Fetch user by email or mobile directly from user_Master (Single Source of Truth)
      const user = await User.findByEmailOrMobile(email);
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }

      // 2. Validate OTP: Matches test OTP '333333' OR user.otp OR valid in otp_table
      const isTestOtp = (otp === '333333' || otp === '123456');
      const isDbOtp = (user.otp && user.otp.toString().trim() === otp.toString().trim());
      let isTableOtp = false;
      try {
        const tableCheck = await otpModel.verifyOtp(user.email_ID || email, otp);
        isTableOtp = tableCheck && tableCheck.isValid;
      } catch (e) {
        // ignore
      }

      if (!isTestOtp && !isDbOtp && !isTableOtp) {
        return res.status(400).send('Invalid or expired OTP.');
      }

      // Generate JWT token
      const token = generateToken(user);
      
      // Set HTTP-only cookie
      res.cookie('ots_auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
      });

      // Response payload with BOTH root fields and nested 'user' object:
      res.status(200).json({
        success: true,
        message: 'OTP verified successfully!',
        token: token,
        user_type: user.user_Type_ID,
        userID: user.user_Code,
        company_Id: user.company_Id ?? 0,
        deliveryman_id: user.deliveryman_id ?? 0,
        user: {
          user_type: user.user_Type_ID,
          userID: user.user_Code,
          company_Id: user.company_Id ?? 0,
          deliveryman_id: user.deliveryman_id ?? 0,
          name: user.user_Name,
          email: user.email_ID,
          mobile: user.mobile_Number
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