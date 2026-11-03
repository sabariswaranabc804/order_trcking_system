module.exports = (otp) => `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f9;
        margin: 0;
        padding: 0;
      }
      .email-container {
        max-width: 600px;
        margin: 20px auto;
        background: #ffffff;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .email-header {
        background-color: #004aad;
        color: #ffffff;
        text-align: center;
        padding: 20px;
      }
      .email-header img {
        max-width: 130px;
        margin-bottom: 10px;
      }
      .email-header h1 {
        margin: 0;
        font-size: 24px;
      }
      .email-body {
        padding: 20px;
      
      }
      .email-body p {
        font-size: 16px;
        line-height: 1.5;
        margin: 0 0 15px;
      }
      .otp-code {
        font-size: 24px;
        color: #007bff;
        font-weight: bold;
        text-align: center;
        margin: 20px 0;
      }
      .copy-btn {
        display: block;
        margin: 10px auto;
        padding: 10px 20px;
        background-color: #007bff;
        color: #ffffff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        text-align: center;
      }
      .copy-btn:hover {
        background-color: #0056b3;
      }
      .email-footer {
        background-color: #f4f4f9;
        text-align: center;
        padding: 10px;
        font-size: 12px;
        color: #999999;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">
       
        <h1>Your OTP Code</h1>
      </div>
      <div class="email-body">
        <p>Hi there,</p>
        <p>We received a request to verify your account. Use the OTP code below to complete the process. This code will expire in <strong>5 minutes</strong>.</p>
        <div class="otp-code" id="otp-code">${otp}</div>
      
        <p>If you didn’t request this, you can safely ignore this email.</p>
        
        <p>Thank you,</p>
        <p>kirush Laundry Team</p>
      </div>
      <div class="email-footer">
        <p>&copy; ${new Date().getFullYear()}kirush Laundry . All rights reserved.</p>
      </div>
    </div>
    <script>
      function copyToClipboard() {
        const otpElement = document.getElementById('otp-code');
        if (otpElement) {
          const otpText = otpElement.innerText;
          navigator.clipboard.writeText(otpText)
            .then(() => {
              alert('OTP code copied to clipboard!');
            })
            .catch(err => {
              alert('Failed to copy OTP code. Please try again.');
            });
        } else {
          alert('OTP code not found!');
        }
      }
    </script>
  </body>
  </html>
`;
