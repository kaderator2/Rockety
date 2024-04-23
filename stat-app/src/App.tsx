import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';

import HomePage from './components/HomePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import UploadPage from './components/UploadPage';
import Contact from './components/Contact';
import AboutPage from './components/AboutPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import Login from './components/Login';
import CreateAccount from './components/CreateAccount';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import AccountPage from './components/AccountPage';
import AnalysisPage from './components/AnalysisPage';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    return (
        <Router>
            <AppContainer>
                <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/upload" element={<UploadPage />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/privacy" element={<PrivacyPolicyPage />} />
                    <Route path="/create-account" element={<CreateAccount />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/analysis" element={<AnalysisPage />} />
                    <Route path="*" element={<div />} />
                    {/* Add other routes */}
                </Routes>
                <Footer />
            </AppContainer>
        </Router>
    );
};

export default App;
