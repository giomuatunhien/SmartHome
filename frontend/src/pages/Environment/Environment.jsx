import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Environment.css';

const Environment = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  // State để quản lý toggle switch
  const [fanOn, setFanOn] = useState(false);
  const [lightOn, setLightOn] = useState(false);


  // Cập nhật thời gian thực tế mỗi giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Xử lý logout
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Chuyển hướng đến trang cấu hình biểu đồ
  const handleChartDetail = () => {
    navigate('/chart-config');
  };

  // Chuyển hướng đến trang cấu hình thiết bị
  const handleDeviceDetail = () => {
    navigate('/devices-config');
  };

  return (
    <main className="main-content">
      <header className="main-header">
        <h1>Environment Monitor</h1>
        <div className="search-bar">
          <input type="text" placeholder="Search for something" />
        </div>

      </header>

      <section className="environment-section">
        {/* Environment Info Card */}
        <div className="env-info-card">
          <div className="env-details">
            <div className="env-item">
              <span className="env-label">Nhiệt độ</span>
              <span className="env-value">24°C</span>
            </div>
            <div className="env-item">
              <span className="env-label">Độ ẩm</span>
              <span className="env-value">18%</span>
            </div>
            <div className="env-item">
              <span className="env-label">Ánh sáng</span>
              <span className="env-value">20%</span>
            </div>
            <div className="env-item">
              <span className="env-label">Start session</span>
              <span className="env-value">4.57</span>
            </div>
          </div>
          <div className="env-chart">
            <h3>Biểu đồ môi trường</h3>
            <div className="chart-placeholder">
              <p>Chưa có thông tin</p>
              <div className="chart-legend">
                <span>Nhiệt độ</span>
                <span>Độ ẩm</span>
                <span>Content</span>
              </div>
            </div>
            <select className="chart-period">
              <option>This Year</option>
              <option>This Month</option>
              <option>This Week</option>
            </select>
            <button className="chart-detail-btn" onClick={handleChartDetail}>
              Xem chi tiết
            </button>
          </div>
        </div>

        {/* Control Panel */}
        <div className="control-panel">
          <h3>Bảng điều khiển</h3>
          <div className="control-buttons">
            <div className="control-item">
              <span className="control-label">Quạt trần</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={fanOn}
                  onChange={() => setFanOn(!fanOn)}
                />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="control-item">
              <span className="control-label">Đèn</span>
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
          <button className="view-details-btn" onClick={handleDeviceDetail}>
            Xem chi tiết
          </button>
        </div>
      </section>
    </main>
  );
};

export default Environment;