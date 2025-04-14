import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './Environment.css';

const Environment = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  // State để quản lý toggle switch
  const [fanOn, setFanOn] = useState(false);
  const [lightOn, setLightOn] = useState(false);
  const [acOn, setAcOn] = useState(false);
  const [countdown, setCountdown] = useState(5);
  //đếm countdown
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          fetchEnvData();  // Gọi hàm lấy dữ liệu mà không reload trang
          return 5; // Đặt lại giá trị đếm ngược
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);



  // Cập nhật thời gian thực tế mỗi giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [envData, setEnvData] = useState({
    temperature: "--",
    humidity: "--",
    light: "--",
  });

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


  const getThresholdsAndUpdateStatus = useCallback(async () => {
    try {
      const updatedDevices = [];

      // Định nghĩa các loại thiết bị và thuộc tính cần kiểm tra
      const deviceTypes = [
        { type: "fan", attribute: "temperature" },
        { type: "light", attribute: "light" }
      ];

      for (const { type, attribute } of deviceTypes) {
        // Lấy danh sách thiết bị theo loại
        const response = await fetch(`http://localhost:3001/device/search?type=${type}`);
        const data = await response.json()
        const devices = data.data;

        for (const device of devices) {
          let newStatus = device.status;

          // Kiểm tra vượt ngưỡng kích hoạt và tắt
          if (type === "fan") {
            // Bật nếu nhiệt độ cao hơn activationThreshold
            if (envData[attribute] > device.activationThreshold) {
              newStatus = "On";
            }
            // Tắt nếu nhiệt độ thấp hơn deactivationThreshold
            else if (envData[attribute] < device.deactivationThreshold) {
              newStatus = "Off";
            }
          }

          else if (type === "light") {
            // Bật nếu ánh sáng thấp hơn activationThreshold (tức là trời tối)
            if (envData[attribute] < device.activationThreshold) {
              newStatus = "On";
            }
            // Tắt nếu ánh sáng cao hơn deactivationThreshold (tức là trời sáng)
            else if (envData[attribute] > device.deactivationThreshold) {
              newStatus = "Off";
            }
          }
          // Cập nhật trạng thái nếu vượt ngưỡng
          if (newStatus !== device.status) {
            console.log(`🚀 Gửi yêu cầu cập nhật: ${type} -> ${newStatus}`);
            // await fetch(`http://localhost:3001/device/update/${device._id}`, {
            //   method: "PUT",
            //   headers: {
            //     "Content-Type": "application/json"
            //   },
            //   body: JSON.stringify({ status: newStatus })
            // });

            await fetch(`http://localhost:3001/device/controlDevice`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ device: type, newStatus: newStatus })
            });
            //console.log(type, newStatus)

            // Thêm vào danh sách đã cập nhật
            updatedDevices.push({ ...device, status: newStatus });
          }
        }
      }
      //console.log("Danh sách thiết bị đã cập nhật trạng thái:", updatedDevices);
      return updatedDevices;
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái thiết bị:", error);
    }
  }, [envData]); // Phụ thuộc vào `envData`

  useEffect(() => {
    if (envData.temperature !== "--" && envData.light !== "--") {
      getThresholdsAndUpdateStatus();
    }
  }, [envData, getThresholdsAndUpdateStatus]);

  // Hàm fetch trạng thái thiết bị
  const fetchDeviceStatus = async () => {
    try {
      const response = await fetch("http://localhost:3001/device/getAll");
      if (!response.ok) throw new Error("Lỗi khi gọi API");

      const result = await response.json();
      const devices = result.data;

      // Cập nhật trạng thái của từng thiết bị
      devices.forEach((device) => {
        if (device.type === "fan") setFanOn(device.status === "On");
        if (device.type === "light") setLightOn(device.status === "On");
        if (device.type === "ac") setAcOn(device.status === "On");
      });
    } catch (error) {
      console.error("Lỗi khi lấy trạng thái thiết bị:", error);
    }
  };

  useEffect(() => {
    fetchEnvData();
    fetchDeviceStatus();
    const interval = setInterval(() => {
      fetchEnvData();
      fetchDeviceStatus();
    }, 5000); // Cập nhật mỗi 5 giây

    return () => clearInterval(interval);
  }, []);


  // Chuyển hướng đến trang cấu hình biểu đồ
  const handleChartDetail = () => {
    navigate('/chart-config');
  };

  // Chuyển hướng đến trang cấu hình thiết bị
  const handleDeviceDetail = () => {
    navigate('/devices-config');
  };

  const handleToggleDevice = async (deviceType, currentStatus, setDeviceState) => {
    try {
      const newStatus = currentStatus ? "Off" : "On";
      // const response = await fetch("http://localhost:3001/device/getAll");
      // if (!response.ok) throw new Error("Lỗi khi gọi API");

      // const result = await response.json();
      // const devices = result.data;
      // devices.forEach(async (device) => {
      //   if (device.type === deviceType) {
      //     await fetch(`http://localhost:3001/device/update/${device._id}`, {
      //       method: "PUT",
      //       headers: {
      //         "Content-Type": "application/json"
      //       },
      //       body: JSON.stringify({ status: newStatus })
      //     });
      //     // Gửi yêu cầu cập nhật trạng thái thiết bị lên server
      //     await fetch(`http://localhost:3001/device/controlDevice`, {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json"
      //       },
      //       body: JSON.stringify({ device: deviceType, newStatus: newStatus })
      //     });
      //     // Cập nhật trạng thái hiển thị trên giao diện
      //     setDeviceState(!currentStatus);
      //   }
      // });
      // Gửi yêu cầu cập nhật trạng thái thiết bị lên server
      //console.log(deviceType, newStatus)
      await fetch(`http://localhost:3001/device/controlDevice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ device: deviceType, newStatus: newStatus })
      });
      // Cập nhật trạng thái hiển thị trên giao diện
      setDeviceState(!currentStatus);



    } catch (error) {
      console.error(`Lỗi khi cập nhật trạng thái ${deviceType}:`, error);
    }
  };

  // Dữ liệu biểu đồ
  const data = [
    { name: "Q1", temperature: 40, humidity: 20, content: 30 },
    { name: "Q2", temperature: 35, humidity: 25, content: 45 },
    { name: "Q3", temperature: 50, humidity: 30, content: 20 },
    { name: "Q4", temperature: 45, humidity: 35, content: 25 }
  ];

  return (
    <main className="main-content">
      <header className="main-header">
        <h1>Environment Monitor</h1>
        <div className="search-bar">
          <input type="text" placeholder="Search for something" />
        </div>
        <div className="header-icons">
          <span role="img" aria-label="settings">⚙️</span>
          <span role="img" aria-label="notifications">🔔</span>
        </div>
      </header>

      <section className="environment-section">
        {/* Environment Info Card */}
        <div className="env-info-card">
          <div className="env-details">
            <div className="env-item">
              <span className="env-label">Nhiệt độ</span>
              <span className="env-value">{envData.temperature}°C</span>
            </div>
            <div className="env-item">
              <span className="env-label">Độ ẩm</span>
              <span className="env-value">{envData.humidity}%</span>
            </div>
            <div className="env-item">
              <span className="env-label">Ánh sáng</span>
              <span className="env-value">{envData.light}%</span>
            </div>
            <div className="env-item">
              <span className="env-label">Start session</span>
              <span className="env-value">{countdown}</span>
            </div>
          </div>

          {/* Biểu đồ môi trường */}
          <div className="env-chart">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="temperature" fill="#4285F4" name="Nhiệt độ" />
                <Bar dataKey="humidity" fill="#A020F0" name="Độ ẩm" />
                <Bar dataKey="content" fill="#FF6F61" name="Ánh sáng" />
              </BarChart>
            </ResponsiveContainer>
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
                  onChange={() => handleToggleDevice("fan", fanOn, setFanOn)}
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
                  onChange={() => handleToggleDevice("light", lightOn, setLightOn)}
                />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="control-item">
              <span className="control-label">Điều hòa</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={acOn}
                  onChange={() => setAcOn(!acOn)}
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