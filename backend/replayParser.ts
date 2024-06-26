import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { logger } from './src/logger'
import mongoose from 'mongoose';
import User, { IUser } from './src/models/user';
import { ReplayData } from './src/models/replayFile';
require('dotenv').config({ path: path.resolve(__dirname, '/.env') })
import endpoint from './src/endpoints.config';

const execAsync = promisify(exec);

const processReplayFile = async (replayFilePath: string) => {
    try {
        const replayFileName = path.basename(replayFilePath);
        const parsedFileName = `parsed_${replayFileName}.json`;
        const parsedFilePath = path.join(path.dirname(replayFilePath), parsedFileName);

        // Run the rrrocket command to parse the replay file
        await execAsync(`./rrrocket --json-lines --multiple ${replayFilePath} | jq . > ${parsedFilePath}`);

        // Read the parsed JSON file
        const parsedData = await fs.promises.readFile(parsedFilePath, 'utf8');
        const replayData: ReplayData = JSON.parse(parsedData);

        // Find the user account associated with the replay file
        const replayFileNameFormatted = 'uploads/' + replayFileName;
        const user = await User.findOne({ replays: { $elemMatch: { path: replayFileNameFormatted } } });

        if (user) {
            // Update the replay data in the user's account
            const replayIndex = user.replays.findIndex((replay) => replay.path === replayFileNameFormatted);
            if (replayIndex !== -1) {
                user.replays[replayIndex].data = replayData;
                user.replays[replayIndex].processed = true;
                await User.updateOne(
                    { _id: user._id, 'replays.path': replayFileNameFormatted },
                    {
                        $set: {
                            'replays.$.data': replayData,
                            'replays.$.processed': true,
                        },
                    }
                );
                logger.info(`Replay data stored for user: ${user.email}`);
            }
        }
        // Delete the original replay file and the parsed JSON file
        await fs.promises.unlink(replayFilePath);
        await fs.promises.unlink(parsedFilePath);
        logger.info(`Replay file ${replayFileName} processed and deleted`);
    } catch (error) {
        //TODO: Maybe remove me?
        await fs.promises.unlink(replayFilePath);
        logger.error(`Error processing replay file: ${(error as Error).message}`);
    }
};

const scanForNewReplayFiles = async (uploadsPath: string) => {
    fs.readdir(uploadsPath, async (err, files) => {
        if (err) {
            logger.error('Error reading uploads directory:', err);
            return;
        }

        for (const file of files) {
            if (file.endsWith('.replay')) {
                const replayFilePath = path.join(uploadsPath, file);
                await processReplayFile(replayFilePath);
            }
        }
    });
};

const watchReplayFiles = async () => {
    const uploadsPath = path.join(__dirname, 'uploads');

    // Debug: Check the uploads directory path
    logger.debug('Uploads directory path:', uploadsPath);

    // Debug: Check if the uploads directory exists
    fs.access(uploadsPath, fs.constants.F_OK, (err) => {
        if (err) {
            logger.error('Uploads directory does not exist:', err);
        } else {
            logger.debug('Uploads directory exists');
        }
    });

    // Periodically scan for new replay files every 5 seconds
    setInterval(async () => {
        await scanForNewReplayFiles(uploadsPath);
    }, 5000);

    logger.info('Watching for new replay files...');
};

mongoose.connect(endpoint.MongoUri)
    .then(() => {
        logger.info('Connected to MongoDB');
        watchReplayFiles();
    })
    .catch((error) => {
        logger.error('Error connecting to MongoDB:', error);
    });
