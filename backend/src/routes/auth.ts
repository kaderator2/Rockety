// src/routes/auth.ts
import express from 'express';
import bcrypt from 'bcrypt';
import User, { IUser } from '../models/user';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import { logger } from '../logger'
import endpoint from '../endpoints.config';

const router = express.Router();

// Rate limiter configuration
const loginLimiter = rateLimit({
    windowMs: parseInt(endpoint.LoginCooldown),
    max: 5, // Limit each IP to 5 login requests per window
    message: 'Too many login attempts. Please try again later.',
});

// Rate limiter configuration for forgot password
const forgotPasswordLimiter = rateLimit({
    windowMs: parseInt(endpoint.FPassCooldown),
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
        logger.error('Error registering user:', error);
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
        const token = jwt.sign({ userId: user._id }, endpoint.JWTSecret);

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
        const resetToken = jwt.sign({ userId: user._id }, endpoint.ResetTokenSecret, { expiresIn: '1h' });

        // Save the reset token to the user document in the database
        user.resetToken = resetToken;
        await user.save();

        // Create a Nodemailer transporter
        const transporter = nodemailer.createTransport({
            // Example configuration for Gmail:
            service: endpoint.emailService,
            auth: {
                user: endpoint.emailUser,
                pass: endpoint.emailPassword,
            },
        });

        // Compose the password reset email
        // TODO: CHANGE ME BEFORE PRODUCTION
        const mailOptions = {
            from: 'Rockety Support',
            to: user.email,
            subject: 'Rockety Password Reset',
            html: `
                <p>Hello,</p>
                <p>You have requested to reset your password. Please click the link below to reset your password:</p>
                <a href="${endpoint.BaseUrl}/reset-password?token=${resetToken}">Reset Password</a>
                <p>If you did not request a password reset, please ignore this email.</p>
            `,
        };

        // Send the password reset email
        await transporter.sendMail(mailOptions);

        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Error sending password reset email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Reset password route
router.post('/reset-password', async (req, res) => {
    try {
        const { token, password } = req.body;

        // Verify the reset token
        const decodedToken = jwt.verify(token, endpoint.ResetTokenSecret) as { userId: string };
        const userId = decodedToken.userId;

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the reset token matches the user's stored token
        if (user.resetToken !== token) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user's password and clear the reset token
        user.password = hashedPassword;
        user.resetToken = undefined;
        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
