import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title as ChartTitle,
    Tooltip,
    Legend,
} from 'chart.js';

import {
    Container,
    Content,
    Title as PageTitle,
} from './StyledComponents';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ChartTitle,
    Tooltip,
    Legend
);

const eTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 2rem;
`;

const Button = styled.button`
  background-color: #63b3ed;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-bottom: 1rem;

  &:hover {
    background-color: #4299e1;
  }
`;

const ReplayList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0;
`;

const ReplayItem = styled.li`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  margin-bottom: 0.5rem;
`;

const ReplayCheckbox = styled.input`
  margin-right: 1rem;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const AnalysisResult = styled.div`
  background-color: rgba(42, 42, 42, 0.8);
  padding: 2rem;
  border-radius: 10px;
  max-width: 800px;
  width: 100%;
`;

const ChartContainer = styled.div`
  margin-bottom: 2rem;
`;

const TimelineContainer = styled.div`
  overflow-x: auto;
`;

const TimelineItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

interface User {
    _id: string;
    email: string;
    profilePicture: string;
    replays: ReplayFile[];
    team: string;
    username: string;
}

interface ReplayFile {
    id: string;
    path: string;
    originalname: string;
    processed: boolean;
}

interface TimelineEvent {
    gameId: string;
    time: number;
    player: string;
    type: string;
}

const AnalysisPage: React.FC = () => {
    const [replays, setReplays] = useState<ReplayFile[]>([]);
    const [selectedReplays, setSelectedReplays] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any>(null);

    useEffect(() => {
        fetchReplays();
    }, []);

    const renderPlayerPerformanceChart = () => {
        const data = {
            labels: Object.keys(analysisResult.playerGoals),
            datasets: [
                {
                    label: 'Goals',
                    data: Object.values(analysisResult.playerGoals),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                },
            ],
        };

        const options = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top' as const,
                },
                title: {
                    display: true,
                    text: 'Player Performance',
                },
            },
        };

        return (
            <ChartContainer>
                <Bar data={data} options={options} />
            </ChartContainer>
        );
    };

    const renderMatchTimeline = () => {
        const gameTimelines: { [gameId: string]: TimelineEvent[] } = {};

        analysisResult.timeline.forEach((event: TimelineEvent) => {
            const gameId = event.gameId || 'Unknown Game';
            if (!gameTimelines[gameId]) {
                gameTimelines[gameId] = [];
            }
            gameTimelines[gameId].push(event);
        });

        return (
            <TimelineContainer>
                <h3>Match Timeline</h3>
                {Object.entries(gameTimelines).map(([gameId, events]) => (
                    <div key={gameId} style={{ marginBottom: '2rem' }}>
                        <h4 style={{ marginBottom: '1rem' }}>{gameId}</h4>
                        {events.map((event: TimelineEvent, index: number) => {
                            const minutes = Math.floor(event.time / 60);
                            const seconds = Math.round(event.time % 60);
                            const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

                            return (
                                <TimelineItem key={index} style={{ marginBottom: '0.5rem' }}>
                                    <span style={{ minWidth: '80px', display: 'inline-block' }}>{formattedTime}</span>
                                    <span style={{ minWidth: '150px', display: 'inline-block' }}>{event.player}</span>
                                    <span>{event.type}</span>
                                </TimelineItem>
                            );
                        })}
                    </div>
                ))}
            </TimelineContainer>
        );
    };

    const renderPlayerComparisonChart = () => {
        const data = {
            labels: analysisResult.players,
            datasets: [
                {
                    label: 'Goals',
                    data: analysisResult.players.map((player: string) => analysisResult.playerGoals[player]),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                },
                {
                    label: 'Assists',
                    data: analysisResult.players.map((player: string) => analysisResult.playerAssists[player]),
                    backgroundColor: 'rgba(255, 206, 86, 0.6)',
                },
                {
                    label: 'Saves',
                    data: analysisResult.players.map((player: string) => analysisResult.playerSaves[player]),
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                },
            ],
        };

        const options = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top' as const,
                },
                title: {
                    display: true,
                    text: 'Player Comparison',
                },
            },
        };

        return (
            <ChartContainer>
                <Bar data={data} options={options} />
            </ChartContainer>
        );
    };

    const fetchReplays = async () => {
        try {
            const response = await axios.get<User>('/api/user', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const processedReplays = response.data.replays.filter((replay: ReplayFile) => replay.processed);
            setReplays(processedReplays);
        } catch (error) {
            console.error('Error fetching replays:', error);
        }
    };

    const handleReplaySelect = (replayId: string) => {
        const selectedIndex = selectedReplays.indexOf(replayId);
        if (selectedIndex > -1) {
            setSelectedReplays(selectedReplays.filter((id) => id !== replayId));
        } else {
            setSelectedReplays([...selectedReplays, replayId]);
        }
    };

    const handleSelectAll = () => {
        if (selectedReplays.length === replays.length) {
            setSelectedReplays([]);
        } else {
            setSelectedReplays(replays.map((replay) => replay.id));
        }
    };

    const handleGenerateReport = async () => {
        try {
            setIsLoading(true);
            const response = await axios.post('/api/analysis', { replayIds: selectedReplays }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setAnalysisResult(response.data);
        } catch (error) {
            console.error('Error generating analysis report:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container>
            <Content>
                <PageTitle>Analysis</PageTitle>
                <h3>Select Replays:</h3>
                <Button onClick={handleSelectAll}>
                    {selectedReplays.length === replays.length ? 'Deselect All' : 'Select All'}
                </Button>
                <ReplayList>
                    {replays.map((replay) => (
                        <ReplayItem key={replay.id}>
                            <ReplayCheckbox
                                type="checkbox"
                                checked={selectedReplays.includes(replay.id)}
                                onChange={() => handleReplaySelect(replay.id)}
                            />
                            <span>{replay.originalname}</span>
                        </ReplayItem>
                    ))}
                </ReplayList>
                <Button onClick={handleGenerateReport}>Generate Report!</Button>
                {isLoading && (
                    <LoadingOverlay>
                        <LoadingSpinner />
                    </LoadingOverlay>
                )}
                {analysisResult && (
                    <AnalysisResult>
                        <h2>Analysis Report</h2>
                        {renderPlayerPerformanceChart()}
                        {renderMatchTimeline()}
                        {renderPlayerComparisonChart()}
                    </AnalysisResult>
                )}
            </Content>
        </Container>
    );
};

export default AnalysisPage;
