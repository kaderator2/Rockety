import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #24292e;
  padding: 1rem 2rem;
  border-bottom: 2px solid #1a1f23;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffffff;
  text-decoration: none;
`;

const NavLinks = styled.ul`
  display: flex;
  list-style: none;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  margin-left: 1.5rem;
  transition: color 0.3s;

  &:hover {
    color: #63b3ed;
  }
`;

const AuthButton = styled.button`
  background-color: #63b3ed;
  color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-left: 1.5rem;

  &:hover {
    background-color: #4299e1;
  }
`;

const LogoutButton = styled(AuthButton)`
  background-color: #f56565;

  &:hover {
    background-color: #e53e3e;
  }
`;

interface NavbarProps {
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, setIsLoggedIn }) => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    };

    const handleLogout = () => {
        // Perform logout logic here
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <NavContainer>
            <Logo to="/">Rockety</Logo>
            <NavLinks>
                {isLoggedIn ? (
                    <>
                        <li>
                            <NavLink to="/analysis">Analysis</NavLink>
                        </li>
                        <li>
                            <NavLink to="/profiles">Player Profiles</NavLink>
                        </li>
                        <li>
                            <NavLink to="/upload">Upload</NavLink>
                        </li>
                        <li>
                            <NavLink to="/account">Account</NavLink>
                        </li>
                        <li>
                            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <NavLink to="/profiles">Player Profiles</NavLink>
                        </li>
                        <li>
                            <AuthButton onClick={handleLogin}>Login</AuthButton>
                        </li>
                    </>
                )}
            </NavLinks>
        </NavContainer>
    );
};

export default Navbar;
