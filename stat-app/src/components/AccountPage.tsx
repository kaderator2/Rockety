import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import {
    Container,
    Content,
    Title,
} from './StyledComponents';

const AccountContainer = styled.div`
  background-color: rgba(42, 42, 42, 0.8);
  padding: 2rem;
  border-radius: 10px;
  max-width: 800px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfilePicture = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
`;

const UploadPictureInput = styled.input`
  display: none;
`;

const UploadPictureButton = styled.label`
  background-color: #63b3ed;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

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
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  margin-bottom: 0.5rem;
`;

const DeleteReplayButton = styled.button`
  background-color: #f56565;
  color: #ffffff;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e53e3e;
  }
`;

const SelectTeam = styled.select`
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 5px;
  border: none;
  margin-top: 1rem;
`;

const EsportsStats = styled.div`
  margin-top: 1rem;
`;

interface User {
    _id: string;
    email: string;
    profilePicture: string;
    replays: string[];
    team: string;
    // Add more fields as needed for esports statistics
}

const AccountPage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await axios.get<User>('/api/user', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('profilePicture', file);

            try {
                await axios.post('/api/user/profile-picture', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                fetchUserData();
            } catch (error) {
                console.error('Error uploading profile picture:', error);
            }
        }
    };

    const handleReplayDelete = async (replayId: string) => {
        try {
            await axios.delete(`/api/user/replays/${replayId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            fetchUserData();
        } catch (error) {
            console.error('Error deleting replay:', error);
        }
    };

    const handleTeamChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTeam = event.target.value;

        try {
            await axios.patch('/api/user', { team: selectedTeam }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            fetchUserData();
        } catch (error) {
            console.error('Error updating team:', error);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <Container>
            <Content>
                <Title>Account</Title>
                <AccountContainer>
                    <ProfilePicture src={user.profilePicture} alt="Profile Picture" />
                    <UploadPictureInput
                        type="file"
                        id="profilePictureUpload"
                        accept="image/*"
                        onChange={handleProfilePictureUpload}
                    />
                    <UploadPictureButton htmlFor="profilePictureUpload">Change Profile Picture</UploadPictureButton>
                    <h3>Uploaded Replays:</h3>
                    <ReplayList>
                        {user.replays.map((replay) => (
                            <ReplayItem key={replay.id}>
                                <span>{replay.originalname}</span>
                                <DeleteReplayButton onClick={() => handleReplayDelete(replay.id)}>Delete</DeleteReplayButton>
                            </ReplayItem>
                        ))}
                    </ReplayList>
                    <h3>Team:</h3>
                    <SelectTeam value={user.team} onChange={handleTeamChange}>
                        <option value="">Select Team</option>
                        <option value="Team A">Team A</option>
                        <option value="Team B">Team B</option>
                        {/* Add more team options */}
                    </SelectTeam>
                    <EsportsStats>
                        {/* Display esports statistics */}
                    </EsportsStats>
                </AccountContainer>
            </Content>
        </Container>
    );
};

export default AccountPage;
