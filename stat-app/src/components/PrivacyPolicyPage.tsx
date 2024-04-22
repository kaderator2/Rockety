import React from 'react';
import styled, { keyframes } from 'styled-components';
import {
    Container,
    Content,
    Title,
} from './StyledComponents';

const LastUpdated = styled.p`
  font-size: 1rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const PolicySection = styled.div`
  background-color: rgba(42, 42, 42, 0.8);
  padding: 2rem;
  border-radius: 10px;
  max-width: 800px;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Paragraph = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const PrivacyPolicyPage: React.FC = () => {
    return (
        <Container>
            <Content>
                <Title>Privacy Policy</Title>
                <LastUpdated>Last Updated: March 9, 2024</LastUpdated>
                <PolicySection>
                    <SectionTitle>1. Information We Collect</SectionTitle>
                    <Paragraph>
                        We collect personal information when you register on our site, upload replay files, or engage with other features of our service. The information we collect may include your name, email address, and any other information you provide to us.
                    </Paragraph>

                    <SectionTitle>2. Use of Information</SectionTitle>
                    <Paragraph>
                        We use the information we collect to provide, maintain, and improve our services, as well as to communicate with you about your account and our services. We may also use the information for research and analytics purposes to understand how our services are used.
                    </Paragraph>

                    <SectionTitle>3. Information Sharing</SectionTitle>
                    <Paragraph>
                        We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as required by law or as necessary to provide our services (e.g., sharing with hosting providers).
                    </Paragraph>

                    <SectionTitle>4. Data Security</SectionTitle>
                    <Paragraph>
                        We implement reasonable security measures to protect your personal information from unauthorized access, alteration, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                    </Paragraph>

                    <SectionTitle>5. Changes to This Policy</SectionTitle>
                    <Paragraph>
                        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of the policy.
                    </Paragraph>
                </PolicySection>
            </Content>
        </Container>
    );
};

export default PrivacyPolicyPage;
