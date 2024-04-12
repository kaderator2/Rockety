import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

export const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

export const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  color: #ffffff;
  flex: 1;
  background: linear-gradient(45deg, #ff7f50, #6a5acd, #00ced1, #00ff7f);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite;
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeIn} 1s ease;
`;

export const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 2rem;
`;

export const LoginForm = styled.form`
  background-color: rgba(42, 42, 42, 0.8);
  padding: 2rem;
  border-radius: 10px;
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

export const Input = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 5px;
  border: none;
`;

export const LoginButton = styled.button`
  background-color: #63b3ed;
  color: #ffffff;
  padding: 1rem 2rem;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #4299e1;
  }
`;

export const CreateAccountLink = styled(Link)`
  color: #63b3ed;
  text-decoration: none;
  margin-top: 1rem;
  transition: color 0.3s;

  &:hover {
    color: #4299e1;
  }
`;

export const ForgotPasswordLink = styled(Link)`
  color: #63b3ed;
  text-decoration: none;
  margin-top: 1rem;
  transition: color 0.3s;

  &:hover {
    color: #4299e1;
  }
`;

export const ErrorMessage = styled.p`
  color: #ff4d4d;
  margin-top: 1rem;
`;

export const SuccessMessage = styled.p`
  color: #ffffff;
  margin-top: 1rem;
`;
