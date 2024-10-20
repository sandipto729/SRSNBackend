const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const port = process.env.PORT || 8000;
const userRoutes = require('./routes');
const path = require('path');
const cookieParser =require('cookie-parser');

app.use(cookieParser());

// Load environment variables
require('dotenv').config();

// Connect to MongoDB
connectDB();

// Middleware
const corsOptions = {
    origin: process.env.FRONTEND_URL, 
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', userRoutes);

// Connect to Express Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});