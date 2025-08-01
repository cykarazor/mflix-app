//server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');

const authRoutes = require('./routes/auth');
const commentRoutes = require('./routes/comments');
const thumbsRoutes = require('./routes/thumbs');
const { initSocket } = require('./socket'); // Import your socket module
const adminRoutes = require('./routes/admin');

// Ensure JWT_SECRET is defined
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET is not defined in your environment!');
  process.exit(1);
}

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'https://flower-marigold.netlify.app', // ✅ string only when credentials: true
  credentials: true,
}));

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  // No deprecated options needed in Mongoose v6+
});

// Handle MongoDB connection events
const connection = mongoose.connection;

connection.on('connected', () => {
  console.log('✅ MongoDB connected');
});

connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

// Import and use movie routes
const movieRoutes = require('./routes/movies')(connection);
app.use('/api/movies', movieRoutes);

// Modular route handlers
app.use('/api/auth', authRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/thumbs', thumbsRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.send('🌐 API is running');
});

// Create HTTP server and initialize socket.io
const server = http.createServer(app);
initSocket(server);  // Initialize Socket.IO with the HTTP server


/// Start the server using HTTP server instead of app.listen
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
