// src/routes/protected.ts
import express from 'express';
import multer from 'multer';
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
            console.error('Error checking duplicate file:', error);
            cb(error, false);
        });
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Get user data
router.get('/user', authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select('-password -resetToken');
        res.json(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update profile picture
router.post('/user/profile-picture', authMiddleware, upload.single('profilePicture'), async (req: AuthenticatedRequest, res) => {
    try {
        const userId = req.userId;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: 'No profile picture provided' });
        }

        const profilePicture = file.path;
        await User.findByIdAndUpdate(userId, { profilePicture });
        res.json({ message: 'Profile picture updated successfully' });
    } catch (error) {
        console.error('Error updating profile picture:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete replay
router.delete('/user/replays/:replayId', authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
        const userId = req.userId;
        const replayId = req.params.replayId;
        await User.findByIdAndUpdate(userId, { $pull: { replays: { id: replayId } } });
        res.json({ message: 'Replay deleted successfully' });
    } catch (error) {
        console.error('Error deleting replay:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update team
router.patch('/user', authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
        const userId = req.userId;
        const { team } = req.body;
        await User.findByIdAndUpdate(userId, { team });
        res.json({ message: 'Team updated successfully' });
    } catch (error) {
        console.error('Error updating team:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/upload', authMiddleware, upload.array('replays'), async (req: AuthenticatedRequest, res) => {
    try {
        const userId = req.userId;
        const replayFiles = req.files as Express.Multer.File[];

        // Create replay file objects with unique IDs
        const newReplayFiles: ReplayFile[] = replayFiles.map(file => ({
            id: uuidv4(),
            path: file.path,
            originalname: file.originalname,
        }));

        // Add the new replay files to the user's replays array
        await User.findByIdAndUpdate(userId, { $push: { replays: { $each: newReplayFiles } } });

        // Check if there are any duplicate files
        const duplicateFiles = replayFiles.filter(file => file.mimetype === 'application/octet-stream');

        if (duplicateFiles.length > 0) {
            return res.status(400).json({
                message: 'Duplicate files detected',
                duplicates: duplicateFiles.map(file => file.originalname),
            });
        }

        res.json({ message: 'Replays uploaded successfully' });
    } catch (error) {
        console.error('Error uploading replays:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
