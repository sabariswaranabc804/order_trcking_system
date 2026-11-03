// app.js
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');
const http = require('http');
//const otpRoutes = require('./routes/otpRoutes');
const admin = require('./routes/admin');
const superadmin = require('./routes/superadminRoutes')
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const Razorpay = require('razorpay'); // Add this line
const crypto = require('crypto'); // 
const { Server } = require('socket.io');

//const { connectDB } = require('./db');
const cors = require('cors');
const app = express();
const path = require('path');

const razorpay = new Razorpay({
  key_id: 'rzp_live_bF3uU9wS3BP1N2', // Replace with your Razorpay key ID
  key_secret: 'qUYi7CVzPVtiAmLz0jZam6Sg' // Replace with your Razorpay key secret
});
// Connect to the database fghh
//connectDB();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
// Middleware to parse JSON bodies
//app.use(cors())


app.use(
  cors({
    origin: ["http://localhost:5174", "http://localhost:5173", "http://localhost:5175", "http://136.185.14.8:5557", "https://ots.akilamtechnology.com"],// or your frontend domain
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);
// CORS Configuration




app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Routes
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
//app.use('/api/v1/', otpRoutes);
app.use('/api/v2/superadmin', superadmin);
app.use('/api', admin);
app.use('/api/cart', cartRoutes);

// Razorpay API endpoints
app.post('/api/razorpay/create-order', async (req, res) => {
  try {
    const options = {
      amount: req.body.amount,
      currency: 'INR',
      receipt: 'receipt_' + Date.now(),
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);
    console.log("order", order);

    res.json(order);
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});

app.post('/api/razorpay/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    console.log(req.body);

    // Create a signature using the key secret and order ID
    const generated_signature = crypto
      .createHmac('sha256', razorpay.key_secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    console.log("generated_signature", generated_signature);
    console.log("razorpay_signature", razorpay_signature);

    // Compare the generated signature with the signature received
    if (generated_signature === razorpay_signature) {
      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, message: 'Error verifying payment', error: error.message });
  }
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  //  console.log("coneection");

  socket.on('sendMessage', (msg) => {
    io.emit('receiveMessage', msg);
    console.log("msg", msg);

  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

//TESTING PURPOSE 
app.get('/', (req, res, next) => {
  res.send("Hello , this is api for kirush laundry serives test1");
  console.log("ots services");

})
http://localhost:3001/api/company/null
app.get('/api/company/null', (req, res, next) => {
  res.send("Hello , this is api for ots serives");
  console.log("ots services");

})

app.use(express.static('uploads'))
// Start the server
const PORT = 8099;
// ... existing code ...
// Start the server

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
