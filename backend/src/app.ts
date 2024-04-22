import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import protectedRoutes from './routes/protected';
import path from 'path';
require('dotenv').config()

import endpoint from './endpoints.config';

//const cors = require('cors');
const app = express();
//app.use(cors());

// Middleware
app.use(express.json());

// MongoDB connection
mongoose.connect(endpoint.MongoUri)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// Serve profile pictures
app.use('/uploads/profile-pictures', express.static(path.join(__dirname, 'uploads', 'profile-pictures')));

// Auth routes
app.use('/auth', authRoutes);

// Protected routes
app.use('/api', protectedRoutes);

// Serve the frontend React application
app.use(express.static(path.join(__dirname, '..', '..', 'stat-app', 'build')));

app.get('*', (req, res) => {
    // Serve the profile picture file if the route matches /uploads/profile-pictures/:filename
    if (req.url.startsWith('/uploads/profile-pictures/')) {
        const filename = path.basename(req.url);
        const filePath = path.join(__dirname, '..', 'uploads', 'profile-pictures', filename);
        return res.sendFile(filePath);
    }

    // Serve the frontend React application for all other routes
    res.sendFile(path.join(__dirname, '..', '..', 'stat-app', 'build', 'index.html'));
});

// Start the server
app.listen(endpoint.Port, () => {
    console.log(`Server is running on port ${endpoint.Port}`);
});
