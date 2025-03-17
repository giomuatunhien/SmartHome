import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Menu.css';
import avatarImage from '../../img/avatar.jpg';

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
        <Link to="/home" className={({ isActive }) => (isActive ? 'active' : '')}>
          <span role="img" aria-label="home">🏠</span> Home
        </Link>
        <Link to="/smart-door" className={({ isActive }) => (isActive ? 'active' : '')}>
          <span role="img" aria-label="door">🚪</span> Smart Door Control
        </Link>
        <Link to="/environment" className={({ isActive }) => (isActive ? 'active' : '')}>
          <span role="img" aria-label="environment">🌍</span> Environment Monitor
        </Link>
        <Link to="/smart-voice" className={({ isActive }) => (isActive ? 'active' : '')}>
          <span role="img" aria-label="voice">🎙️</span> Smart Voice
        </Link>
        <Link to="/" onClick={handleLogout} className={({ isActive }) => (isActive ? 'active' : '')}>
          <span role="img" aria-label="logout">🔓</span> Logout
        </Link>
      </nav>
    </aside>
  );
};

export default Menu;