import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #24292e;
  padding: 1rem 2rem;
  border-top: 2px solid #1a1f23;
`;

const FooterLinks = styled.ul`
  display: flex;
  list-style: none;
`;

const FooterLink = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  margin-right: 1.5rem;
  transition: color 0.3s;

  &:hover {
    color: #63b3ed;
  }
`;

const Copyright = styled.p`
  color: #ffffff;
  font-size: 0.9rem;
`;

const Footer: React.FC = () => {
    return (
        <FooterContainer>
            <FooterLinks>
                <li>
                    <FooterLink to="/about">About</FooterLink>
                </li>
                <li>
                    <FooterLink to="/contact">Contact</FooterLink>
                </li>
                <li>
                    <FooterLink to="/privacy">Privacy Policy</FooterLink>
                </li>
                {/* Add more footer links as needed */}
            </FooterLinks>
            <Copyright>&copy; {new Date().getFullYear()} Rockety. All rights reserved.</Copyright>
        </FooterContainer>
    );
};

export default Footer;
