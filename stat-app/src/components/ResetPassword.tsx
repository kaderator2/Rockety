import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import {
    Container,
    Content,
    Title,
    LoginForm,
    FormGroup,
    Label,
    Input,
    LoginButton,
    ErrorMessage,
} from './StyledComponents';

const ResetPassword: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const token = new URLSearchParams(location.search).get('token');

        try {
            await axios.post('/auth/reset-password', { token, password });

            // Clear the form fields and error message
            setPassword('');
            setConfirmPassword('');
            setError('');

            // Redirect to the login page after successful password reset
            navigate('/login');
        } catch (error) {
            console.error('Password reset failed:', error);

            const axiosError = error as AxiosError;
            if (axiosError.response && axiosError.response.status === 400) {
                setError('Invalid or expired reset token');
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    };

    return (
        <Container>
            <Content>
                <Title>Reset Password</Title>
                <LoginForm onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label htmlFor="password">New Password</Label>
                        <Input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </FormGroup>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    <LoginButton type="submit">Reset Password</LoginButton>
                </LoginForm>
            </Content>
        </Container>
    );
};

export default ResetPassword;
