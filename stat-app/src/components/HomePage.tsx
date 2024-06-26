import React from 'react';
import styled, { keyframes } from 'styled-components';
import {
    Container,
} from './StyledComponents';

const Content = styled.div`
  flex: 1;
`;

const Banner = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Intro = styled.p`
  font-size: 1.5rem;
  text-align: center;
  max-width: 800px;
  margin-bottom: 2rem;
`;

const QuickStartGuide = styled.div`
  background-color: rgba(42, 42, 42, 0.8);
  padding: 2rem;
  border-radius: 10px;
  max-width: 800px;
`;

const QuickStartTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const QuickStartSteps = styled.ol`
  font-size: 1.2rem;
  padding-left: 2rem;
`;

const HomePage: React.FC = () => {
    return (
        <Container>
            <Content>
                <Banner>Welcome to Rockety</Banner>
                <Intro>
                    Rockety is a powerful replay analysis tool for Rocket League players and teams. Upload your replays, gain valuable insights, and take your gameplay to the next level!
                </Intro>
                <QuickStartGuide>
                    <QuickStartTitle>Quick Start Guide</QuickStartTitle>
                    <QuickStartSteps>
                        <li>Sign up for a Rockety account or log in if you already have one.</li>
                        <li>Navigate to the Replay Upload section.</li>
                        <li>Drag and drop your Rocket League replay files or select them using the file dialog.</li>
                        <li>Once the upload is complete, head to the Analysis Dashboard to explore your data!</li>
                    </QuickStartSteps>
                </QuickStartGuide>
            </Content>
        </Container>
    );
};

export default HomePage;
