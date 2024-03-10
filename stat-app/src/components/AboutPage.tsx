import React from 'react';
import styled, { keyframes } from 'styled-components';

const gradientAnimation = keyframes`
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

const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
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

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeIn} 1s ease;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 2rem;
`;

const AboutSection = styled.div`
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

const AboutPage: React.FC = () => {
    return (
        <Container>
            <Content>
                <Title>About Rockety</Title>
                <AboutSection>
                    <Paragraph>
                        The purpose of this website, a project sponsored by the University of Arizona's Department of Esports, is to enhance the Rocket League community's engagement and skill through detailed replay analysis and data visualization and provide much-needed stats for us to use.
                    </Paragraph>
                    <Paragraph>
                        As a paid project, it also serves as a practical learning experience to refine my programming abilities, emphasizing the application of React and TypeScript in developing user-centric solutions.
                    </Paragraph>
                    <Paragraph>
                        This project not only contributes to the esports community by providing valuable insights and fostering player development but also advances my expertise as a programmer, aligning with the University's commitment to diverse innovative education and esports excellence.
                    </Paragraph>
                    <Paragraph>
                        It also directly benefits the University of Arizona's Esports Program by allowing us to pull end-of-year stats to celebrate our player's achievements and keep our casters up to date on the latest information.
                    </Paragraph>
                </AboutSection>
            </Content>
        </Container>
    );
};

export default AboutPage;
