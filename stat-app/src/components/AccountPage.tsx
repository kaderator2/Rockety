import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios, { AxiosError } from 'axios';
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

const InputField = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 5px;
  border: none;
  margin-bottom: 1rem;
  width: 100%;
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

const DangerButton = styled(Button)`
  background-color: #f56565;

  &:hover {
    background-color: #e53e3e;
  }
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

interface ErrorResponse {
    message: string;
}


const AccountPage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [username, setUsername] = useState('');
    const [team, setTeam] = useState('');

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
            setUsername(response.data.username);
            setTeam(response.data.team);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleUsernameChange = async () => {
        try {
            await axios.patch('/api/user', { username }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            fetchUserData();
            alert('Username updated successfully');
        } catch (error) {
            console.error('Error updating username:', error);
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<ErrorResponse>;
                if (axiosError.response && axiosError.response.data && axiosError.response.data.message) {
                    alert(axiosError.response.data.message);
                } else {
                    alert('An error occurred while updating the username.');
                }
            } else {
                alert('An error occurred while updating the username.');
            }
        }
    };

    const handleTeamChange = async () => {
        try {
            await axios.patch('/api/user', { team }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            fetchUserData();
            alert('Team updated successfully');
        } catch (error) {
            console.error('Error updating team:', error);
            alert('An error occurred while updating the team.');
        }
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete your account?');
        if (confirmDelete) {
            try {
                await axios.delete('/api/user', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                localStorage.removeItem('token');
                window.location.href = '/'; // Redirect to the home page
            } catch (error) {
                console.error('Error deleting account:', error);
                alert('An error occurred while deleting the account.');
            }
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
                window.location.reload();
            } catch (error) {
                console.error('Error uploading profile picture:', error);
                if (axios.isAxiosError(error)) {
                    const axiosError = error as AxiosError<ErrorResponse>;
                    if (axiosError.response && axiosError.response.data && axiosError.response.data.message) {
                        alert(axiosError.response.data.message);
                    } else {
                        alert('An error occurred while uploading the profile picture.');
                    }
                } else {
                    alert('An error occurred while uploading the profile picture.');
                }
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

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <Container>
            <Content>
                <Title>Account</Title>
                <AccountContainer>
                    {user.profilePicture ? (
                        <ProfilePicture src={`/uploads/profile-pictures/${user.profilePicture}`} alt="Profile Picture" />
                    ) : (
                        <ProfilePicture src="/path/to/default/profile-picture.jpg" alt="Default Profile Picture" />
                    )}
                    <UploadPictureInput
                        type="file"
                        id="profilePictureUpload"
                        accept="image/*"
                        onChange={handleProfilePictureUpload}
                    />
                    <UploadPictureButton htmlFor="profilePictureUpload">Change Profile Picture</UploadPictureButton>
                    <h3>Username:</h3>
                    <InputField
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Button onClick={handleUsernameChange}>Update Username</Button>
                    <h3>Team:</h3>
                    <InputField
                        type="text"
                        value={team}
                        onChange={(e) => setTeam(e.target.value)}
                    />
                    <Button onClick={handleTeamChange}>Update Team</Button>
                    <h3>Uploaded Replays:</h3>
                    {user.replays.length > 0 ? (
                        <ReplayList>
                            {user.replays.map((replay) => (
                                <ReplayItem key={replay.id}>
                                    <span>{replay.originalname}</span>
                                    <DeleteReplayButton onClick={() => handleReplayDelete(replay.id)}>Delete</DeleteReplayButton>
                                </ReplayItem>
                            ))}
                        </ReplayList>
                    ) : (
                        <p>None yet!</p>
                    )}
                    <DangerButton onClick={handleDeleteAccount}>Delete Account</DangerButton>
                </AccountContainer>
            </Content>
        </Container>
    );
};

export default AccountPage;
