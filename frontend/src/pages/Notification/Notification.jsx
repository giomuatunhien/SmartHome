import React, { useState, useEffect } from 'react';
import './Notification.css';

const Notification = () => {
  // State lưu thông báo, trang, kích thước trang, tổng trang, tổng bản ghi
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lấy userID
  const userID = localStorage.getItem('userId');

  useEffect(() => {
    if (!userID) return;

    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:3001/notification/getNotificationById?page=${page}&limit=${pageSize}&userID=${userID}`
        );
        if (!response.ok) throw new Error('Lỗi khi lấy thông báo');
        const json = await response.json();
        if (json.success) {
          const { data, pagination } = json;
          setNotifications(data);
          setPage(pagination.page);
          setPageSize(pagination.limit);
          setTotalPages(pagination.totalPages);
        } else {
          setNotifications([]);
          setTotalPages(1);
        }
      } catch (err) {
        console.error('Fetch notifications error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [page, pageSize, userID]);

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

        {loading ? (
          <p>Đang tải...</p>
        ) : error ? (
          <p className="error">Lỗi: {error}</p>
        ) : notifications.length > 0 ? (
          <table className="notification-table">
            <thead>
              <tr>
                <th>Nội dung</th>
                <th>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((item) => (
                <tr key={item._id}>
                  <td>{item.message}</td>
                  <td>{new Date(item.timestamp).toLocaleString('vi-VN', { hour12: true })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Không có thông báo.</p>
        )}

        {/* Chỉ hiển thị pagination khi >1 page */}
        {!loading && !error && totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>
              Page {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default Notification;
