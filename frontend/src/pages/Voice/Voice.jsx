import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Voice.css';

const Voice = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  // State để quản lý toggle switch
  const [fanOn, setFanOn] = useState(false);
  const [lightOn, setLightOn] = useState(false);

  // Hàm giả lập ghi âm
  const handleRecord = () => {
    alert('Bắt đầu ghi âm... (Giả lập)');
    // Chuyển hướng đến trang danh sách lệnh sau khi ghi âm
    setTimeout(() => navigate('/voice-command-list'), 1000);
  };

  // Chuyển hướng đến trang danh sách lệnh
  const handleShowCommands = () => {
    navigate('/voice-command-list');
  };

  return (
    <main className="main-content">
      <header className="main-header">
        <h1>Smart Voice Assistant</h1>
        <div className="search-bar">
          <input type="text" placeholder="Search for something" />
        </div>

      </header>

      <section className="voice-section">
        <div className="device-container">
          <div className="device-card">
            <h3>Quạt trần</h3>
            <div className="device-info">
              <span>Tỷ lệ quay: 10%</span>
              <span>Nhiệt độ: 25°C</span>
              <span>OFF</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={fanOn}
                onChange={() => setFanOn(!fanOn)}
              />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="device-card">
            <h3>Đèn</h3>
            <div className="device-info">
              <span>Độ sáng: 10%</span>
              <span>Mức độ: 15%</span>
              <span>OFF</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={lightOn}
                onChange={() => setLightOn(!lightOn)}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
        <div className="voice-controls">
          <button className="record-btn" onClick={handleRecord}>
            <span role="img" aria-label="microphone">🎙️</span>
          </button>
          <button className="commands-btn" onClick={handleShowCommands}>
            Danh sách lệnh
          </button>
        </div>
      </section>
    </main>
  );
};

export default Voice;