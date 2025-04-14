import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DevicesConfig.css';

const DevicesConfig = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const [fanThresholds, setFanThresholds] = useState({
    on: 0,
    off: 0,
  });
  const [lightThresholds, setLightThresholds] = useState({
    on: 0,
    off: 0,
  });
  const [acThresholds, setAcThresholds] = useState({
    on: 0,
    off: 0,
  });

  useEffect(() => {
    // Lấy ngưỡng từ API
    const fetchThresholds = async () => {
      try {
        const response = await fetch('http://localhost:3001/device/getAll');
        const result = await response.json();
        const data = result.data;

        // Duyệt qua từng thiết bị trong data và cập nhật ngưỡng
        data.forEach(device => {
          const { type, activationThreshold = 0, deactivationThreshold = 0 } = device;

          if (type === 'fan') {
            setFanThresholds({ on: activationThreshold, off: deactivationThreshold });
          } else if (type === 'light') {
            setLightThresholds({ on: activationThreshold, off: deactivationThreshold });
          } else if (type === 'ac') {
            setAcThresholds({ on: activationThreshold, off: deactivationThreshold });
          }
        });
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ API:', error);
      }
    };


    fetchThresholds();
  }, []);


  const handleSave = async () => {
    const devices = [
      { id: '67da7464058ba8efaa8d6d56', type: 'fan', thresholds: fanThresholds },
      { id: '67da73a797d4c705e0075121', type: 'light', thresholds: lightThresholds },
    ];
    try {
      // Lặp qua từng thiết bị và gọi API cập nhật riêng cho từng cái
      for (const device of devices) {
        const response = await fetch(`http://localhost:3001/device/update/${device.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            activationThreshold: device.thresholds.on,
            deactivationThreshold: device.thresholds.off,
          }),
        });

        if (!response.ok) {
          alert(`Lỗi khi lưu dữ liệu của thiết bị ${device.type}. Vui lòng thử lại!`);
          return;
        }
      }

      alert('Ngưỡng thiết bị đã được lưu thành công!');
      navigate('/environment');
    } catch (error) {
      console.error('Lỗi khi gửi dữ liệu lên API:', error);
      alert('Lỗi kết nối API. Vui lòng kiểm tra lại!');
    }
  };

  const handleThresholdChange = (device, type, value) => {
    const newValue = Math.max(0, Math.min(100, Number(value)));

    if (device === 'fan') {
      setFanThresholds((prev) => ({ ...prev, [type]: newValue }));
    } else if (device === 'light') {
      setLightThresholds((prev) => ({ ...prev, [type]: newValue }));
    } else if (device === 'ac') {
      setAcThresholds((prev) => ({ ...prev, [type]: newValue }));
    }
  };


  const handleBack = () => {
    navigate('/environment');
  };

  // const handleSave = () => {
  //   alert('Ngưỡng thiết bị đã được lưu!');
  //   navigate('/environment');
  // };

  // const handleFanChange = (type, value) => {
  //   setFanThresholds((prev) => ({
  //     ...prev,
  //     [type]: Math.max(0, Math.min(100, Number(value))),
  //   }));
  // };

  // const handleLightChange = (type, value) => {
  //   setLightThresholds((prev) => ({
  //     ...prev,
  //     [type]: Math.max(0, Math.min(100, Number(value))),
  //   }));
  // };

  // const handleAcChange = (type, value) => {
  //   setAcThresholds((prev) => ({
  //     ...prev,
  //     [type]: Math.max(0, Math.min(100, Number(value))),
  //   }));
  // };



  return (
    <main className="main-content">
      <header className="main-header">
        <h1>Devices Configuration</h1>
        <div className="search-bar">
          <input type="text" placeholder="Search for something" />
        </div>
        <div className="header-icons">
          <span role="img" aria-label="settings">⚙️</span>
          <span role="img" aria-label="notifications">🔔</span>
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
                onChange={(e) => handleThresholdChange('fan', 'on', e.target.value)}
              /> °C
            </div>
            <div className="threshold-row">
              <label>Ngưỡng tắt: </label>
              <input
                type="number"
                value={fanThresholds.off}
                onChange={(e) => handleThresholdChange('fan', 'off', e.target.value)}
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
                onChange={(e) => handleThresholdChange('light', 'on', e.target.value)}
              /> %
            </div>
            <div className="threshold-row">
              <label>Ngưỡng tắt: </label>
              <input
                type="number"
                value={lightThresholds.off}
                onChange={(e) => handleThresholdChange('light', 'off', e.target.value)}
              /> %
            </div>
          </div>
          <div className="device-item">
            <h3>Điều hòa</h3>
            <div className="threshold-row">
              <label>Ngưỡng bật: </label>
              <input
                type="number"
                value={acThresholds.on}
                onChange={(e) => handleThresholdChange('ac', 'on', e.target.value)}
              /> %
            </div>
            <div className="threshold-row">
              <label>Ngưỡng tắt: </label>
              <input
                type="number"
                value={acThresholds.off}
                onChange={(e) => handleThresholdChange('ac', 'off', e.target.value)}
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