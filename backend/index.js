// const express = require('express');
// const app = express();
// const cors = require('cors');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');
// const port = process.env.PORT || 8000;
// const userRoutes = require('./routes');
// const path = require('path');
// const cookieParser =require('cookie-parser');
// const http = require('http');
// const { Server } = require('socket.io');
// import SocketHandler  from './Socket/SocketHandler';
// // Load environment variables
// require('dotenv').config();

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: process.env.FRONTEND_URL,
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   },
// });

// app.use(cookieParser());



// // Connect to MongoDB
// connectDB();

// // Middleware
// const corsOptions = {
//     origin: process.env.FRONTEND_URL, 
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//   };

// app.use(cors(corsOptions));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Routes
// app.use('/api', userRoutes);
// app.use(express.static(path.join(__dirname, 'public')));
// SocketHandler(io);

// // Connect to Express Server
// server.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });



const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');
const SocketHandler = require('./Socket/SocketHandler');

// Disable ETags to prevent 304 responses
app.set('etag', false);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Load environment variables
dotenv.config();

const port = process.env.PORT || 8000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Connect to MongoDB
connectDB();

// Middleware
// CORS: Allow requests from frontend (browser origin, not Docker internal)
// Since nginx proxies requests, backend receives browser's Origin header
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  // Add production frontend URL here if different
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // For development, allow any localhost origin
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

// Prevent caching for API routes
app.use('/api', (req, res, next) => {
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, private',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  next();
});

// Routes
const userRoutes = require('./routes'); 
app.use('/api', userRoutes);


SocketHandler(io); 

// Connect to Server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
