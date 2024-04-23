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
            return res.status(404).json({ message: 'User not found' });
        }

        const selectedReplays = user.replays.filter((replay) => replayIds.includes(replay.id));
        const analysisResult = generateAnalysisReport(selectedReplays);

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

    replays.forEach((replay) => {
        if (replay.data) {
            replay.data.replay.properties.PlayerStats.forEach((playerStat) => {
                const playerName = playerStat.Name;
                if (playerName in playerGoals) {
                    playerGoals[playerName] += playerStat.Goals;
                    playerAssists[playerName] += playerStat.Assists;
                    playerSaves[playerName] += playerStat.Saves;
                } else {
                    playerGoals[playerName] = playerStat.Goals;
                    playerAssists[playerName] = playerStat.Assists;
                    playerSaves[playerName] = playerStat.Saves;
                }
            });

            if (replay.data.replay && replay.data.replay.properties) {
                const gameId = replay.data.replay.properties.Id;
                replay.data.replay.properties.Goals.forEach((goal) => {
                    timeline.push({
                        gameId,
                        time: goal.frame / replay.data!.replay.properties.RecordFPS,
                        player: goal.PlayerName,
                        type: 'Goal',
                    });
                });
            }

            // Add more events to the timeline (saves, demolitions, etc.)
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
