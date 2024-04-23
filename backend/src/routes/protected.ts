// src/routes/protected.ts
import express from 'express';
import multer from 'multer';
import { logger } from '../logger'
import path from 'path';
import { authMiddleware } from '../middleware/auth';
import User, { IUser } from '../models/user';
import { v4 as uuidv4 } from 'uuid';
import { ReplayFile } from '../models/replayFile';

const router = express.Router();

interface AuthenticatedRequest extends express.Request {
    userId?: string;
}

// Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); // Specify the directory to save the uploaded files
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Set the filename of the uploaded file
    },
});

const fileFilter = (req: AuthenticatedRequest, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const userId = req.userId;
    User.findById(userId)
        .then(user => {
            if (!user) {
                return cb(null, false);
            }
            const isDuplicate = user.replays.some(replay => replay.originalname === file.originalname);
            if (isDuplicate) {
                return cb(null, false);
            }
            cb(null, true);
        })
        .catch(error => {
            logger.error('Error checking duplicate file:', error);
            cb(error, false);
        });
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post('/upload', authMiddleware, upload.array('replays'), async (req: AuthenticatedRequest, res) => {
    try {
        const userId = req.userId;
        const replayFiles = req.files as Express.Multer.File[];

        // Create replay file objects with unique IDs
        const newReplayFiles: ReplayFile[] = replayFiles.map(file => ({
            id: uuidv4(),
            path: file.path,
            originalname: file.originalname,
            processed: false,
        }));

        // Check if there are any duplicate files
        // const duplicateFiles = replayFiles.filter(file => file.mimetype === 'application/octet-stream');

        // TODO: Fix this?
        // if (duplicateFiles.length > 0) {
        //     return res.status(400).json({
        //         message: 'Duplicate files detected',
        //         duplicates: duplicateFiles.map(file => file.originalname),
        //     });
        // }

        // Add the new replay files to the user's replays array
        await User.findByIdAndUpdate(userId, { $push: { replays: { $each: newReplayFiles } } });
        res.json({ message: 'Replays uploaded successfully' });
    } catch (error) {
        logger.error('Error uploading replays:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
