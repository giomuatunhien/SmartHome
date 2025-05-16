import React, { useState, useEffect, useCallback } from 'react';
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

  const [envData, setEnvData] = useState({
    temperature: "--",
    humidity: "--",
    light: "--",
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Gọi API từ backend bằng fetch()
  useEffect(() => {
    const fetchEnvData = async () => {
      try {
        const response = await fetch("http://localhost:3001/envdat/getdata");
        if (!response.ok) {
          throw new Error("Lỗi khi gọi API");
        }
        const result = await response.json();
        const data = result.data;

        const getLatestData = (sensorID) => {
          // Lọc dữ liệu theo sensorID và sắp xếp giảm dần theo timestamp
          const sensorData = data
            .filter(item => item.sensorID === sensorID)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

          // Lấy bản ghi có timestamp mới nhất
          return sensorData.length > 0 ? sensorData[0].value : "--";
        };

        setEnvData({
          temperature: getLatestData('67da7bf0058ba8efaa8d6d60'),
          humidity: getLatestData('67da7c01058ba8efaa8d6d62'),
          light: getLatestData('67da7c0e058ba8efaa8d6d64'),
        });
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu môi trường:", error);
      }
    };

    fetchEnvData();
    const interval = setInterval(fetchEnvData, 1000); // Cập nhật mỗi 5 giây

    return () => clearInterval(interval);
  }, []);


  // Gọi API lấy trạng thái cửa
  const fetchDoorStatus = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3001/smart_door/status");
      const result = await response.json();
      setIsDoorOn(result.data === "unlocked");
    } catch (error) {
      console.error("Lỗi khi lấy trạng thái cửa:", error);
    }
  }, [setIsDoorOn]);

  useEffect(() => {
    fetchDoorStatus();
    const interval = setInterval(fetchDoorStatus, 1000); // Cập nhật trạng thái cửa mỗi 5 giây
    return () => clearInterval(interval);
  }, [fetchDoorStatus]);


  // Xử lý khi click vào toggle Smart Door
  const handleDoorToggle = async () => {
    if (isDoorOn) {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch("http://localhost:3001/smart_door/close", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          credentials: "include",
          body: JSON.stringify({ userId }),
        });
        const data = await response.json();

        if (response.ok) {
          setIsDoorOn(false);
          alert("Cửa đã đóng!");
        } else {
          alert(data.message || "Lỗi khi đóng cửa!");
        }
      } catch (error) {
        console.error("Lỗi đóng cửa:", error);
        alert("Không thể kết nối đến server!");
      }
    } else {
      navigate("/smart-door"); // Điều hướng sang nhập mật khẩu
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
                <span className="info-value">{envData.temperature}°C</span>
              </div>
            </div>

            {/* Độ ẩm */}
            <div className="info-card humidity-card">
              <img src={doamIcon} alt="Humidity Icon" className="info-icon" />
              <div className="info-content">
                <span className="info-label">Độ ẩm</span>
                <span className="info-value">{envData.humidity}%</span>
              </div>
            </div>

            {/* Ánh sáng */}
            <div className="info-card light-card">
              <img src={anhsangIcon} alt="Light Icon" className="info-icon" />
              <div className="info-content">
                <span className="info-label">Ánh sáng</span>
                <span className="info-value">{envData.light}%</span>
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