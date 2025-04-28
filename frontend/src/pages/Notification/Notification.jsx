import React from 'react';
import './Notification.css';

const Notification = () => {
  // Dữ liệu thông báo mẫu
  const notifications = [
    { id: 1, content: 'Cửa được mở bởi Đậu Ngọc Quân', time: '28 Apr, 10:30 AM' },
    { id: 2, content: 'Thử mở cửa thất bại (Face AI)', time: '28 Apr, 10:25 AM' },
    { id: 3, content: 'Mật mã sai từ Nguyen Van B', time: '28 Apr, 10:20 AM' },
    { id: 4, content: 'Cửa được mở bởi Nguyen Van C', time: '28 Apr, 10:15 AM' },
  ];

  return (
    <main className="main-content">
      <header className="main-header">
        <h1>Notifications</h1>
        <div className="search-bar">
          <input type="text" placeholder="Search for something" />
        </div>
      </header>

      <section className="notification-section">
        <h2>Danh sách thông báo</h2>
        <table className="notification-table">
          <thead>
            <tr>
              <th>Nội dung</th>
              <th>Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((item) => (
              <tr key={item.id}>
                <td>{item.content}</td>
                <td>{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
};

export default Notification;