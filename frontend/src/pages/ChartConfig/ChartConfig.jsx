import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChartConfig.css';

const ChartConfig = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const [selectedSensor, setSelectedSensor] = useState('Nhiệt độ');
  const [chartType, setChartType] = useState('Line Chart');
  const [environmentLevel, setEnvironmentLevel] = useState('Cao');
  const [timePeriod, setTimePeriod] = useState('Thoát tuần');

  const handleBack = () => {
    navigate('/environment');
  };

  const handleSave = () => {
    alert('Cấu hình biểu đồ đã được lưu!');
    navigate('/environment');
  };

  return (
    <main className="main-content">
      <header className="main-header">
        <h1>Chart Configuration</h1>
        <div className="search-bar">
          <input type="text" placeholder="Search for something" />
        </div>
        <div className="header-icons">
          <span role="img" aria-label="settings">⚙️</span>
          <span role="img" aria-label="notifications">🔔</span>
        </div>
      </header>

      <section className="chart-config-section">
        <div className="config-card">
          <div className="config-item">
            <label>Danh sách cảm biến</label>
            <select
              value={selectedSensor}
              onChange={(e) => setSelectedSensor(e.target.value)}
            >
              <option>Nhiệt độ</option>
              <option>Độ ẩm</option>
              <option>Ánh sáng</option>
            </select>
          </div>
          <div className="config-item">
            <label>Chọn kiểu biểu đồ</label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
            >
              <option>Line Chart</option>
              <option>Column Chart</option>
            </select>
          </div>
          <div className="config-item">
            <label>Chỉ số môi trường</label>
            <select
              value={environmentLevel}
              onChange={(e) => setEnvironmentLevel(e.target.value)}
            >
              <option>Cao</option>
              <option>Trung bình</option>
              <option>Thấp</option>
            </select>
          </div>
          <div className="config-item">
            <label>Khoảng thời gian phân tích</label>
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
            >
              <option>Theo Tuần</option>
              <option>Theo Tháng</option>
              <option>Theo Năm</option>
            </select>
          </div>
          <div className="config-actions">
            <button className="view-btn" onClick={handleBack}>
              Xem thử
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

export default ChartConfig;