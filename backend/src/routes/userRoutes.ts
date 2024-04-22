// src/routes/userRoutes.ts
import express from 'express';
import { logger } from '../logger'
import multer from 'multer';
import path from 'path';
import { authMiddleware } from '../middleware/auth';
import User, { IUser } from '../models/user';
import fs from 'fs';
const router = express.Router();

interface AuthenticatedRequest extends express.Request {
    userId?: string;
}

const profilePictureStorage = multer.diskStorage({
    destination: function(req: AuthenticatedRequest, file, cb) {
        cb(null, 'uploads/profile-pictures/');
        req.userId = (req as AuthenticatedRequest).userId; // Pass the userId to the filename function
    },
    filename: function(req: AuthenticatedRequest, file, cb) {
        cb(null, req.userId + path.extname(file.originalname));
    },
});

// Get user data
router.get('/user', authMiddleware, async (req: AuthenticatedRequest, res) => {
    // logger.debug(`user info get endpoint hit!`);
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select('-password -resetToken');
        res.json(user);
    } catch (error) {
        logger.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Update user
router.patch('/user', authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
        const userId = req.userId;
        const { username, team } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser && existingUser._id.toString() !== userId) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        await User.findByIdAndUpdate(userId, { username, team });
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        logger.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete user account
router.delete('/user', authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
        const userId = req.userId;

        // Delete the user's profile picture
        const user = await User.findById(userId);
        if (user && user.profilePicture) {
            const profilePicturePath = path.join(__dirname, '..', 'uploads', 'profile-pictures', user.profilePicture);
            fs.unlink(profilePicturePath, (err) => {
                if (err) {
                    logger.error('Error deleting profile picture:', err);
                }
            });
        }

        // Delete the user's replay files
        if (user && user.replays.length > 0) {
            user.replays.forEach((replay) => {
                const replayFilePath = path.join(__dirname, '..', '..', replay.path);
                fs.unlink(replayFilePath, (err) => {
                    if (err) {
                        logger.error('Error deleting replay file:', err);
                    }
                });
            });
        }

        // Delete the user account
        await User.findByIdAndDelete(userId);

        res.json({ message: 'User account deleted successfully' });
    } catch (error) {
        logger.error('Error deleting user account:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

const profilePictureUpload = multer({
    storage: profilePictureStorage,
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
    },
    fileFilter: function(req, file, cb) {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, and GIF images are allowed.'));
        }
    },
});

// Update profile picture
router.post('/user/profile-picture', authMiddleware, profilePictureUpload.single('profilePicture'), async (req: AuthenticatedRequest, res) => {
    try {
        const userId = req.userId;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: 'No profile picture provided' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete the previous profile picture if it exists
        if (user.profilePicture) {
            const previousProfilePicturePath = path.join(__dirname, '..', 'uploads', 'profile-pictures', user.profilePicture);
            fs.unlink(previousProfilePicturePath, (err) => {
                if (err) {
                    logger.error('Error deleting previous profile picture:', err);
                }
            });
        }

        const profilePicture = file.filename;
        await User.findByIdAndUpdate(userId, { profilePicture });
        res.json({ message: 'Profile picture updated successfully' });
    } catch (error) {
        logger.error('Error updating profile picture:', error);
        if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'Profile picture exceeds the maximum allowed size of 5MB' });
        }
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
        logger.error('Error updating team:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete replay
router.delete('/user/replays/:replayId', authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
        const userId = req.userId;
        const replayId = req.params.replayId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const replayIndex = user.replays.findIndex(replay => replay.id === replayId);
        if (replayIndex === -1) {
            return res.status(404).json({ message: 'Replay not found' });
        }

        const replay = user.replays[replayIndex];
        const replayFilePath = path.join(__dirname, '..', '..', replay.path);

        // Delete the replay file from the server
        fs.unlink(replayFilePath, (err) => {
            if (err) {
                logger.warn('Error deleting replay file:', err);
            }
        });

        // Remove the replay from the user's replays array
        user.replays.splice(replayIndex, 1);
        await user.save();

        res.json({ message: 'Replay deleted successfully' });
    } catch (error) {
        logger.error('Error deleting replay:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
