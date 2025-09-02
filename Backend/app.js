const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require('dotenv').config();

const app = express();

// Routes imports
const assetRoutes = require("./routes/assetRoutes");
const authRoute = require("./routes/auth");
const adminRoutes = require("./routes/AdminUsers");
const assignmentRoutes = require('./routes/assignmentRoutes');
const employeeRoutes = require('./routes/employee');

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://mulu-asset.netlify.app",
    credentials: true, // Add this if using cookies/auth
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

// Database connection - Moved to the top and improved
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/assetmanagement';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit process with failure
  }
};

connectDB();

// Routes
app.use("/api/assets", assetRoutes); // Added prefix for better API structure
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/employees', employeeRoutes);

// Models (keep these if needed for the routes below)
const AdminUser = require('./models/AdminUser');
const Assignment = require('./models/Assignment');

// API endpoints with proper route prefixes
app.post('/api/users', async (req, res) => {
  try {
    console.log('User creation request:', req.body);
    const newUser = new AdminUser(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('User creation error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

app.post('/api/assignments', async (req, res) => {
  try {
    const { userId, assetId, assignmentDate, status } = req.body;
    const newAssignment = new Assignment({ 
      userId, 
      assetId, 
      assignmentDate, 
      status 
    });
    await newAssignment.save();
    res.status(201).json(newAssignment);
  } catch (error) {
    console.error('Assignment creation error:', error);
    res.status(400).json({ 
      message: error.message,
      error: 'Bad request' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.originalUrl
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown handling
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});
