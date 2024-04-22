import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
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
axios.defaults.baseURL = "http://localhost:5000/";

const LoginLink = styled(Link)`
  color: #63b3ed;
  text-decoration: none;
  margin-top: 1rem;
  transition: color 0.3s;

  &:hover {
    color: #4299e1;
  }
`;

const CreateAccount: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await axios.post('/auth/register', { email, password });

            // Clear the form fields and error message
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setError('');

            // Redirect to the login page after successful account creation
            navigate('/login');
        } catch (error) {
            console.error('Account creation failed:', error);

            const axiosError = error as AxiosError;
            if (axiosError.response && axiosError.response.status === 400) {
                setError('User already exists');
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    };

    return (
        <Container>
            <Content>
                <Title>Create Account</Title>
                <LoginForm onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="password">Password</Label>
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
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setError('');
                            }}
                            required
                        />
                        {password !== confirmPassword && <ErrorMessage>Passwords do not match</ErrorMessage>}
                    </FormGroup>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    <LoginButton type="submit">Create Account</LoginButton>
                </LoginForm>
                <LoginLink to="/login">
                    Already have an account? Login here
                </LoginLink>
            </Content>
        </Container>
    );
};

export default CreateAccount;
