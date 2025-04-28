import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DevicesConfig.css';

const DevicesConfig = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const [fanThresholds, setFanThresholds] = useState({
    on: 24,
    off: 20,
  });
  const [lightThresholds, setLightThresholds] = useState({
    on: 10,
    off: 5,
  });
  const [acThresholds, setAcThresholds] = useState({
    on: 50,
    off: 40,
  });

  const handleBack = () => {
    navigate('/environment');
  };

  const handleSave = () => {
    alert('Ngưỡng thiết bị đã được lưu!');
    navigate('/environment');
  };

  const handleFanChange = (type, value) => {
    setFanThresholds((prev) => ({
      ...prev,
      [type]: Math.max(0, Math.min(100, Number(value))),
    }));
  };

  const handleLightChange = (type, value) => {
    setLightThresholds((prev) => ({
      ...prev,
      [type]: Math.max(0, Math.min(100, Number(value))),
    }));
  };

  const handleAcChange = (type, value) => {
    setAcThresholds((prev) => ({
      ...prev,
      [type]: Math.max(0, Math.min(100, Number(value))),
    }));
  };

  return (
    <main className="main-content">
      <header className="main-header">
        <h1>Devices Configuration</h1>
        <div className="search-bar">
          <input type="text" placeholder="Search for something" />
        </div>

      </header>

      <section className="devices-config-section">
        <div className="config-card">
          <div className="device-item">
            <h3>Quạt trần</h3>
            <div className="threshold-row">
              <label>Ngưỡng bật: </label>
              <input
                type="number"
                value={fanThresholds.on}
                onChange={(e) => handleFanChange('on', e.target.value)}
              /> °C
            </div>
            <div className="threshold-row">
              <label>Ngưỡng tắt: </label>
              <input
                type="number"
                value={fanThresholds.off}
                onChange={(e) => handleFanChange('off', e.target.value)}
              /> °C
            </div>
          </div>
          <div className="device-item">
            <h3>Đèn</h3>
            <div className="threshold-row">
              <label>Ngưỡng bật: </label>
              <input
                type="number"
                value={lightThresholds.on}
                onChange={(e) => handleLightChange('on', e.target.value)}
              /> %
            </div>
            <div className="threshold-row">
              <label>Ngưỡng tắt: </label>
              <input
                type="number"
                value={lightThresholds.off}
                onChange={(e) => handleLightChange('off', e.target.value)}
              /> %
            </div>
          </div>

          <div className="config-actions">
            <button className="save-btn" onClick={handleBack}>
              Quay lại
            </button>
            <button className="save-btn" onClick={handleSave}>
              Lưu cập nhật
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DevicesConfig;