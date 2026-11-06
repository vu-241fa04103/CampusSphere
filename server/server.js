const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/mentorship', require('./routes/mentorRoutes'));
app.use('/api/doubts', require('./routes/doubtRoutes'));
app.use('/api/notices', require('./routes/noticeRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Serve Frontend Static Build (Unified Full-Stack Deployment)
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// Fallback to React index.html for all non-API frontend routes (SPA client routing)
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: `API endpoint '${req.originalUrl}' does not exist on CampusSphere server`
    });
  }
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n============================================================`);
  console.log(`🚀 CampusSphere Full-Stack Application is LIVE!`);
  console.log(`🌐 Open in your browser: http://localhost:${PORT}`);
  console.log(`============================================================\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Error: ${err.message}`);
});
