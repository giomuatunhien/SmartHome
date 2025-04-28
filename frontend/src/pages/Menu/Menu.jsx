import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Menu.css';
import avatarImage from '../../img/avatar.jpg';
import homeIcon from '../../img/home.png';
import doorIcon from '../../img/door.png';
import enviIcon from '../../img/envi.png';
import voiceIcon from '../../img/voice.png';
import logoutIcon from '../../img/logout.png';

const Menu = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleAvatarClick = () => {
    navigate('/account');
  };

  return (
    <aside className="sidebar">
      <div className="user-info">
        <img
          src={avatarImage}
          alt="User Avatar"
          className="avatar"
          onClick={handleAvatarClick}
          style={{ cursor: 'pointer' }}
        />
        <span className="username">Admin</span>
      </div>
      <nav className="sidebar-nav">
        <Link to="/home" className="sidebar-link">
          <img src={homeIcon} alt="Home Icon" className="sidebar-icon" /> Home
        </Link>
        <Link to="/smart-door" className="sidebar-link">
          <img src={doorIcon} alt="Door Icon" className="sidebar-icon" /> Smart Door Control
        </Link>
        <Link to="/environment" className="sidebar-link">
          <img src={enviIcon} alt="Environment Icon" className="sidebar-icon" /> Environment Monitor
        </Link>
        <Link to="/smart-voice" className="sidebar-link">
          <img src={voiceIcon} alt="Voice Icon" className="sidebar-icon" /> Smart Voice
        </Link>
        <Link to="/" onClick={handleLogout} className="sidebar-link logout-link">
          <img src={logoutIcon} alt="Logout Icon" className="sidebar-icon" /> Logout
        </Link>
      </nav>
    </aside>
  );
};

export default Menu;