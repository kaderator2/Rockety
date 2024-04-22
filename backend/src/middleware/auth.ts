// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../logger'
import endpoint from '../endpoints.config';

export interface AuthRequest extends Request {
    userId?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, endpoint.JWTSecret) as { userId: string };
        req.userId = decoded.userId;
        next();
    } catch (error) {
        logger.warn(`Unauthorized user attempting to access protected route!`);
        res.status(401).json({ message: 'Invalid token' });
    }
};
