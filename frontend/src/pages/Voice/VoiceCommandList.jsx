import React from 'react';
import { useNavigate } from 'react-router-dom';
import './VoiceCommandList.css';

const VoiceCommandList = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/smart-voice');
  };

  return (
    <main className="main-content">
      <header className="main-header">
        <h1>Smart Voice Assistant</h1>
        <div className="search-bar">
          <input type="text" placeholder="Search for something" />
        </div>

      </header>

      <section className="command-section">
        <div className="command-card">
          <h3>Quạt</h3>
          <ul>
            <li>Turn on fan</li>
            <li>Turn off fan</li>
            <li>Increase speed</li>
            <li>Decrease speed</li>
            <li>Change mode</li>
          </ul>
          <h3>Đèn</h3>
          <ul>
            <li>Turn on light</li>
            <li>Turn off light</li>
            <li>Something</li>
          </ul>
          <button className="back-btn" onClick={handleBack}>
            Quay lại
          </button>
        </div>
      </section>
    </main>
  );
};

export default VoiceCommandList;