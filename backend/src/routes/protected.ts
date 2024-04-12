// src/routes/protected.ts
import express from 'express';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/profile', authMiddleware, (req, res) => {
    // Access the authenticated user's ID using req.userId
    res.json({ message: 'Protected route accessed successfully' });
});

export default router;
