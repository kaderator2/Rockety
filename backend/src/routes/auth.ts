// src/routes/auth.ts
import express from 'express';
import bcrypt from 'bcrypt';
import User, { IUser } from '../models/user';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiter configuration
const loginLimiter = rateLimit({
    // TODO: CHANGE ME BACK BEFORE DEPLOYMENT
    // windowMs: 15 * 60 * 1000, // 15 minutes
    windowMs: 10, // 15 minutes
    max: 5, // Limit each IP to 5 login requests per window
    message: 'Too many login attempts. Please try again later.',
});

// Rate limiter configuration for forgot password
const forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 forgot password requests per window
    message: 'Too many forgot password requests. Please try again later.',
});

router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser: IUser = new User({
            email,
            password: hashedPassword,
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/login', loginLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret');

        res.json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Forgot password route
router.post('/forgot-password', forgotPasswordLimiter, async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a password reset token
        const resetToken = jwt.sign({ userId: user._id }, 'your_reset_token_secret', { expiresIn: '1h' });

        // Save the reset token to the user document in the database
        user.resetToken = resetToken;
        await user.save();

        // Send the password reset email to the user
        // You can use an email service like Nodemailer or SendGrid to send the email
        // The email should include a link with the reset token, e.g., https://your-app.com/reset-password?token=resetToken

        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Error sending password reset email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
