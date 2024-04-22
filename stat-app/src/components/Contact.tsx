import React from 'react';
import styled from 'styled-components';
import {
    Container,
    Content,
    Title,
    FormGroup,
    Label,
    Input,
} from './StyledComponents';

const ContactForm = styled.form`
  background-color: rgba(42, 42, 42, 0.8);
  padding: 2rem;
  border-radius: 10px;
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const TextArea = styled.textarea`
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 5px;
  border: none;
  resize: vertical;
  min-height: 150px;
`;

const SubmitButton = styled.button`
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

const ContactPage: React.FC = () => {
    return (
        <Container>
            <Content>
                <Title>Contact Us</Title>
                <ContactForm>
                    <FormGroup>
                        <Label htmlFor="name">Name</Label>
                        <Input type="text" id="name" required />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" id="email" required />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="message">Message</Label>
                        <TextArea id="message" required />
                    </FormGroup>
                    <SubmitButton type="submit">Send Message</SubmitButton>
                </ContactForm>
            </Content>
        </Container>
    );
};

export default ContactPage;
