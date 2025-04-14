import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = ({ setIsLoggedIn, isDoorOn, setIsDoorOn }) => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  // // Cập nhật thời gian thực tế mỗi giây
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCurrentTime(new Date());
  //   }, 1000);
  //   return () => clearInterval(timer);
  // }, []);

  // // Xử lý khi click vào toggle Smart Door
  // const handleDoorToggle = () => {
  //   if (isDoorOn) {
  //     // Nếu cửa đang mở, đóng cửa ngay lập tức
  //     setIsDoorOn(false);
  //   } else {
  //     // Nếu cửa đang đóng, chuyển hướng sang trang Smart Door để nhập mật khẩu
  //     navigate('/smart-door');
  //   }
  // };

  // State lưu nhiệt độ, độ ẩm, ánh sáng
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
        const response = await fetch("http://localhost:3001/smart_door/close", {
          method: "POST",
          credentials: "include",
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
            <span className="env-value">{envData.temperature}°C</span>
          </div>
          <div className="env-card">
            <span className="env-label">Độ ẩm</span>
            <span className="env-value">{envData.humidity}%</span>
          </div>
          <div className="env-card">
            <span className="env-label">Ánh sáng</span>
            <span className="env-value">{envData.light}%</span>
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