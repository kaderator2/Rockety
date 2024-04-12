import React from 'react';
import styled from 'styled-components';
import {
    Container,
    Content,
    Title,
} from './StyledComponents';

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
