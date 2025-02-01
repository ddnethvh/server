import React from 'react';
import { Link } from 'react-router-dom';
import HamburgerMenu from '../HamburgerMenu/HamburgerMenu';
import './NavBar.css';

const NavBar = () => {
  return (
    <nav className="cyber-nav">
      <Link to="/" className="nav-brand">
        DDNet<span className="highlight">HvH</span>
      </Link>
      
      <HamburgerMenu />
    </nav>
  );
};

export default NavBar; 