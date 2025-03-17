import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = ({ setIsLoggedIn, isDoorOn, setIsDoorOn }) => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Cập nhật thời gian thực tế mỗi giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Xử lý khi click vào toggle Smart Door
  const handleDoorToggle = () => {
    if (isDoorOn) {
      // Nếu cửa đang mở, đóng cửa ngay lập tức
      setIsDoorOn(false);
    } else {
      // Nếu cửa đang đóng, chuyển hướng sang trang Smart Door để nhập mật khẩu
      navigate('/smart-door');
    }
  };

  return (
    <main className="main-content">
      <header className="main-header">
        <h1>YOLO HOME</h1>
        <div className="search-bar">
          <input type="text" placeholder="Search for something" />
        </div>
        <div className="header-icons">
          <span role="img" aria-label="settings">⚙️</span>
          <span role="img" aria-label="notifications">🔔</span>
        </div>
      </header>

      <section className="dashboard">
        {/* Environment Cards */}
        <div className="env-container">
          <div className="env-card">
            <span className="env-label">Nhiệt độ</span>
            <span className="env-value">24°C</span>
          </div>
          <div className="env-card">
            <span className="env-label">Độ ẩm</span>
            <span className="env-value">18%</span>
          </div>
          <div className="env-card">
            <span className="env-label">Ánh sáng</span>
            <span className="env-value">20%</span>
          </div>
          <div className="env-card">
            <span className="env-label">Thời gian</span>
            <span className="env-value">{currentTime.toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Smart Door Control */}
        <div className="door-control">
          <span className="door-label">Smart Door</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={isDoorOn}
              onChange={handleDoorToggle}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </section>
    </main>
  );
};

export default Home;