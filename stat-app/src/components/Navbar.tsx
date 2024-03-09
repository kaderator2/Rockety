import React from 'react';
import { Link } from 'react-router-dom';
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

const Navbar: React.FC = () => {
    return (
        <NavContainer>
            <Logo to="/">Rockety</Logo>
            <NavLinks>
                <li>
                    <NavLink to="/analysis">Analysis</NavLink>
                </li>
                <li>
                    <NavLink to="/profiles">Player Profiles</NavLink>
                </li>
                <li>
                    <NavLink to="/upload">Upload</NavLink>
                </li>
                {/* Add more navigation items as needed */}
            </NavLinks>
        </NavContainer>
    );
};

export default Navbar;
