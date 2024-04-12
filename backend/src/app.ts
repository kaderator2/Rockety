import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import protectedRoutes from './routes/protected';

const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());

// Middleware
app.use(express.json());

// MongoDB connection
const mongoURI = 'mongodb://localhost:27017/your_database';
mongoose.connect(mongoURI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// Auth routes
app.use('/auth', authRoutes);

// Protected routes
app.use('/api', protectedRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
