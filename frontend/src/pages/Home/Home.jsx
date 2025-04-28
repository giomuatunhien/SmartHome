import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import nhietdoIcon from '../../img/nhietdo.png';
import doamIcon from '../../img/doam.png';
import anhsangIcon from '../../img/anhsang.png';
import timeIcon from '../../img/time.png';
import openDoorIcon from '../../img/opendoor.png';
import closeDoorIcon from '../../img/closedoor.png';

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

  // Xử lý khi click vào ô Smart Door
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

      </header>

      <section className="dashboard">
        <div className="dashboard-container">
          {/* Ô vuông lớn chứa 4 ô nhỏ */}
          <div className="env-grid">
            {/* Nhiệt độ */}
            <div className="info-card temperature-card">
              <img src={nhietdoIcon} alt="Temperature Icon" className="info-icon" />
              <div className="info-content">
                <span className="info-label">Nhiệt độ</span>
                <span className="info-value">24°C</span>
              </div>
            </div>

            {/* Độ ẩm */}
            <div className="info-card humidity-card">
              <img src={doamIcon} alt="Humidity Icon" className="info-icon" />
              <div className="info-content">
                <span className="info-label">Độ ẩm</span>
                <span className="info-value">18%</span>
              </div>
            </div>

            {/* Ánh sáng */}
            <div className="info-card light-card">
              <img src={anhsangIcon} alt="Light Icon" className="info-icon" />
              <div className="info-content">
                <span className="info-label">Ánh sáng</span>
                <span className="info-value">20%</span>
              </div>
            </div>

            {/* Thời gian */}
            <div className="info-card time-card">
              <img src={timeIcon} alt="Time Icon" className="info-icon" />
              <div className="info-content">
                <span className="info-label">Thời gian</span>
                <span className="info-value">{currentTime.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {/* Smart Door */}
          <div className="door-card" onClick={handleDoorToggle}>
            <img
              src={isDoorOn ? openDoorIcon : closeDoorIcon}
              alt={isDoorOn ? 'Open Door' : 'Close Door'}
              className="door-icon"
            />
            <div className="info-content">
              <span className="info-label">Smart Door</span>
              <span className="info-value">{isDoorOn ? 'Opened' : 'Closed'}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;