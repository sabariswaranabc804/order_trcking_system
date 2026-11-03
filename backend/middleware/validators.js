const { body, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }
  next();
};

// Registration validation rules
const registerValidation = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  
  body('mobile')
    .notEmpty().withMessage('Mobile number is required')
    .trim() // Remove whitespace
    .matches(/^[6-9][0-9]{9}$/).withMessage('Mobile number must be 10 digits and start with 6-9')
    .custom((value) => {
      if (value.includes(' ')) {
        throw new Error('Mobile number should not contain spaces');
      }
      return true;
    }),
  
  validate
];

// Login validation rules
const loginValidation = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  
  validate
];

// OTP verification validation rules
const otpValidation = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  
  body('otp')
    .notEmpty().withMessage('OTP is required')
    .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
    .isNumeric().withMessage('OTP must contain only numbers'),
  
  validate
];




module.exports = {
  registerValidation,
  loginValidation,
  otpValidation,

};