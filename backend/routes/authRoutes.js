const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const { registerValidation, loginValidation, otpValidation } = require('../middleware/validators');

// Public routes
router.post('/register', registerValidation, authController.register);
router.post('/send-otp', loginValidation, authController.sendOtp);
router.post('/verify-otp', otpValidation, authController.verifyOtp);
router.post('/logout', authController.logout);

// Protected routes - require authentication
router.get('/me', authMiddleware, authController.getCurrentUser);

//anchor
router.get('/anchors', authMiddleware, authController.getAllAnchors);

//user summary
router.get('/user-summary',  authController.getUserSummary);

router.get('/counts',  authController.userCounts);
//router.post('/anchors', authMiddleware, authController.createAnchor);
//router.put('/anchors/:id', authMiddleware, authController.updateAnchor);
//router.delete('/anchors/:id', authMiddleware, authController.deleteAnchor);

module.exports = router;