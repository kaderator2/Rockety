import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import HomePage from './components/HomePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const App: React.FC = () => {
    return (
        <Router>
            <AppContainer>
                <Navbar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                </Routes>
                <Footer />
            </AppContainer>
        </Router>
    );
};

export default App;
