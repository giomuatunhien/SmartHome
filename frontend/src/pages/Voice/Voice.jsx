import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Voice.css';

const Voice = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  // State để quản lý toggle switch
  const [fanOn, setFanOn] = useState(false);
  const [fanSpeed, setFanSpeed] = useState(0);
  const [lightOn, setLightOn] = useState(false);
  const [lightLevel, setLightLevel] = useState(0);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await fetch('http://localhost:3001/device/getAll');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();
        const devices = result.data;

        const fan = devices.find(d => d.type.toLowerCase() === 'fan');
        const light = devices.find(d => d.type.toLowerCase() === 'light');
        if (fan) {
          setFanOn(fan.status === 'On');
          setFanSpeed(fan.speed);
        }
        if (light) {
          setLightOn(light.status === 'On');
          setLightLevel(light.status === 'On' ? 100 : 0);
        }
      } catch (err) {
        console.error('Lỗi khi fetch devices:', err);
      }
    };

    fetchDevices();
    const interval = setInterval(fetchDevices, 1000); // Cập nhật mỗi 1 giây

    return () => clearInterval(interval);
  }, []);


  const [isRecording, setIsRecording] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleRecord = async () => {
    // reset
    setStatusMessage('Chuẩn bị ghi âm...');

    setIsRecording(true);
    const talkTimer = setTimeout(() => {
      setStatusMessage('Đang lắng nghe... Vui lòng nói lệnh');
    }, 1500);
    try {
      const userId = localStorage.getItem("userId");
      const res = await fetch(
        `http://localhost:3001/voice_recognition_system/start-recording/${userId}`,
        { method: 'POST' }
      );
      clearTimeout(talkTimer);
      //await new Promise(r => setTimeout(r, 1000));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (data.transcript) {
        setStatusMessage(`"${data.transcript}"`);
      } else if (data.error) {
        setStatusMessage(data.error);
      }

    } catch (err) {
      console.error('Lỗi khi gọi start-recording:', err);
      setStatusMessage('Không thể kết nối đến hệ thống ghi âm.');
    } finally {
      setIsRecording(false);
    }
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
              <span>Tốc độ quay: {fanSpeed}</span>
              <span>Trạng thái: {fanOn ? 'ON' : 'OFF'}</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={fanOn}
              //onChange={() => setFanOn(!fanOn)}
              />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="device-card">
            <h3>Đèn</h3>
            <div className="device-info">
              <span>Mức độ: {lightLevel}</span>
              <span>Trạng thái: {lightOn ? 'ON' : 'OFF'}</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={lightOn}
              //onChange={() => setLightOn(!lightOn)}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
        <div className="voice-controls">
          <button
            className={`record-btn ${isRecording ? 'listening' : ''}`}
            onClick={handleRecord}
            disabled={isRecording}
          >
            {isRecording
              ? 'Đang lắng nghe...'
              : <span role="img" aria-label="microphone">🎙️</span>
            }
          </button>
          <button className="commands-btn" onClick={handleShowCommands}>
            Danh sách lệnh
          </button>
        </div>
        {/* Single status message or transcript/error */}
        {statusMessage && (
          <div className="status-log">
            <p>{statusMessage}</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default Voice;