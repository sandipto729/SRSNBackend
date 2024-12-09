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
app.use(cors({
  origin: process.env.FRONTEND_URL, 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));


// Routes
const userRoutes = require('./routes'); 
app.use('/api', userRoutes);


SocketHandler(io); 

// Connect to Server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
