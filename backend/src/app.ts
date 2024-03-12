import express from 'express';
import mongoose from 'mongoose';

const app = express();
const port = process.env.PORT || 5000;
const routes = require('./routes');

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

// Routes
app.get('/', (req, res) => {
    res.send('Hello, World!');
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
app.use('/api/', routes);
