import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './VoiceCommandList.css';

const TYPE_LABELS = {
  fan: 'Quạt',
  light: 'Đèn',
  // nếu có thêm loại khác, cứ bổ sung ở đây
};

const VoiceCommandList = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const [commandsByType, setCommandsByType] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCommands = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3001/voice_recognition_system/getCommands');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { commands } = await res.json();

      // gom nhóm
      const grouped = commands.reduce((acc, cmd) => {
        const type = cmd.commandType;
        if (!acc[type]) acc[type] = [];
        acc[type].push(cmd);
        return acc;
      }, {});

      setCommandsByType(grouped);
    } catch (err) {
      console.error(err);
      setError('Không lấy được danh sách lệnh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommands();
  }, []);

  const handleBack = () => {
    navigate('/smart-voice');
  };

  if (loading) {
    return <div className="loading">Đang tải danh sách lệnh...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

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
          {Object.entries(commandsByType).map(([type, cmds]) => (
            <div key={type} className="command-group">
              <h3>{TYPE_LABELS[type] || type}</h3>
              <ul>
                {cmds.map(cmd => (
                  <li key={cmd._id}>{cmd.commandText}</li>
                ))}
              </ul>
            </div>
          ))}

          <button className="back-btn" onClick={handleBack}>
            Quay lại
          </button>
        </div>
      </section>
    </main>
  );
};

export default VoiceCommandList;
