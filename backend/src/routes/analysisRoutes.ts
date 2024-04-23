import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { logger } from '../logger'
import { ReplayFile } from '../models/replayFile';
import User from '../models/user';

const router = express.Router();

interface AuthenticatedRequest extends express.Request {
    userId?: string;
}

router.post('/analysis', authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
        const userId = req.userId;
        const { replayIds } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            logger.debug('cant find user!');
            return res.status(404).json({ message: 'User not found' });
        }

        logger.debug('selecting replays');
        const selectedReplays = user.replays.filter((replay) => replayIds.includes(replay.id));
        logger.debug('generating report');
        const analysisResult = generateAnalysisReport(selectedReplays);

        logger.debug('sending result');
        res.json(analysisResult);
    } catch (error) {
        logger.error('Error generating analysis report:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

const generateAnalysisReport = (replays: ReplayFile[]) => {
    const playerGoals: { [key: string]: number } = {};
    const playerAssists: { [key: string]: number } = {};
    const playerSaves: { [key: string]: number } = {};
    const timeline: { gameId: string; time: number; player: string; type: string }[] = [];
    logger.debug('set all constants');

    replays.forEach((replay) => {
        logger.debug('looping through replays!');
        if (replay.data && replay.data.replay) {
            if (replay.data.replay.properties) {
                replay.data.replay.properties.PlayerStats.forEach((playerStat) => {
                    const playerName = playerStat.Name;
                    logger.debug('got player name');
                    if (playerName in playerGoals) {
                        playerGoals[playerName] += playerStat.Goals;
                        playerAssists[playerName] += playerStat.Assists;
                        playerSaves[playerName] += playerStat.Saves;
                    } else {
                        playerGoals[playerName] = playerStat.Goals;
                        playerAssists[playerName] = playerStat.Assists;
                        playerSaves[playerName] = playerStat.Saves;
                    }
                    logger.debug('updated player stats');
                });

                logger.debug('moving on!');
                const gameId = replay.data.replay.properties.Id;
                logger.debug('got game id');
                replay.data.replay.properties.Goals.forEach((goal) => {
                    timeline.push({
                        gameId,
                        time: goal.frame / replay.data!.replay.properties.RecordFPS,
                        player: goal.PlayerName,
                        type: 'Goal',
                    });
                });
                logger.debug('pushed stats');
            }
        } else {
            logger.warn('Replay data or replay object is missing:', replay);
        }
    });

    const players = Object.keys(playerGoals);

    return {
        playerGoals,
        playerAssists,
        playerSaves,
        timeline,
        players,
    };
};

export default router;
