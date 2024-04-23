import React, { useState } from 'react';
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
    CreateAccountLink,
    ForgotPasswordLink,
    ErrorMessage,
} from './StyledComponents';

interface LoginProps {
    onLogin: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('/auth/login', { email, password });
            const { token } = response.data;

            // Store the token in local storage or session storage
            localStorage.setItem('token', token);

            // Call the onLogin function passed from App.tsx with the token
            onLogin(token);

            // Clear the form fields and error message
            setEmail('');
            setPassword('');
            setError('');

            // Redirect to the desired page after successful login
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);

            const axiosError = error as AxiosError;
            if (axiosError.response && axiosError.response.status === 401) {
                setError('Invalid email or password');
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    };

    return (
        <Container>
            <Content>
                <Title>Login</Title>
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
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    <LoginButton type="submit">Login</LoginButton>
                </LoginForm>
                <ForgotPasswordLink to="/forgot-password">
                    Forgot password?
                </ForgotPasswordLink>
                <CreateAccountLink to="/create-account">
                    Don't have an account? Create one here
                </CreateAccountLink>
            </Content>
        </Container>
    );
};

export default Login;
