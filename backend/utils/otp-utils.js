const axios = require('axios');  // Add Axios to make HTTP requests

// Generate a 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP via email (mock function - replace with actual email service)
async function sendOtpEmail(email, otp) {
  try {
    console.log(`OTP ${otp} sent to email: ${email}`);
    // In a real application, you would use a service like Nodemailer or SendGrid
    // Example with SendGrid:
    // await sgMail.send({
    //   to: email,
    //   from: 'your-verified-sender@example.com',
    //   subject: 'Your OTP for Zeal Travels',
    //   text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
    //   html: `<p>Your OTP is: <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
    // });
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
}

// Send OTP via WhatsApp (placeholder function)
async function sendOtpWhatsApp(phone, otp) {
  try {
    console.log(`OTP ${otp} sent to WhatsApp: ${phone}`);
    // Implement actual WhatsApp API integration here
    return true;
  } catch (error) {
    console.error('Error sending OTP via WhatsApp:', error);
    throw error;
  }
}

module.exports = { generateOtp, sendOtpEmail, sendOtpWhatsApp };