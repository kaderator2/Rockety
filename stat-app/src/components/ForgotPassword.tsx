import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    SuccessMessage,
} from './StyledComponents';
axios.defaults.baseURL = "http://localhost:5000/";

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await axios.post('/auth/forgot-password', { email });

            setSuccess(true);
            setEmail('');
            setError('');
        } catch (error) {
            console.error('Forgot password failed:', error);

            const axiosError = error as AxiosError;
            if (axiosError.response && axiosError.response.status === 404) {
                setError('User not found');
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    };

    return (
        <Container>
            <Content>
                <Title>Forgot Password</Title>
                {!success ? (
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
                        {error && <ErrorMessage>{error}</ErrorMessage>}
                        <LoginButton type="submit">Reset Password</LoginButton>
                    </LoginForm>
                ) : (
                    <SuccessMessage>
                        Password reset link has been sent to your email. Please check your inbox.
                    </SuccessMessage>
                )}
            </Content>
        </Container>
    );
};

export default ForgotPassword;
