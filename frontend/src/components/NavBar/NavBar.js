import React from 'react';
import { Link } from 'react-router-dom';
import DropdownButton from './DropdownButton/DropdownButton';
import './NavBar.css';

const NavBar = () => {
  const rankItems = (
    <>
      <Link to="/leaderboard/fng" className="dropdown-item">FNG</Link>
      <Link to="/leaderboard/block" className="dropdown-item">Block</Link>
      <Link to="/leaderboard/dm" className="dropdown-item">DM</Link>
      <Link to="/leaderboard/kog" className="dropdown-item">KoG</Link>
    </>
  );

  return (
    <nav className="cyber-nav">
      <Link to="/" className="nav-brand">
        DDNet<span className="highlight">HvH</span>
      </Link>
      
      <div className="nav-menu">
        <DropdownButton label="Ranks">
          {rankItems}
        </DropdownButton>
        <Link to="/cheats" className="nav-link">Cheats</Link>
        <Link to="/developer" className="nav-link">Developer</Link>
      </div>
    </nav>
  );
};

export default NavBar; 