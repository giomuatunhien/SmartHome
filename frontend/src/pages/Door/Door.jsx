import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Door.css';
import faceAiIcon from '../../img/faceai.png';

const Door = ({ setIsLoggedIn, isDoorOn, setIsDoorOn }) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [showFaceUpdateModal, setShowFaceUpdateModal] = useState(false);
  const [facePassword, setFacePassword] = useState('');
  const [facePasswordError, setFacePasswordError] = useState('');
  const [showUploadFaceModal, setShowUploadFaceModal] = useState(false);
  const [facePreviews, setFacePreviews] = useState([null, null])
  const [faceFiles, setFaceFiles] = useState([null, null])
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError('');
  };

  const handleOpenDoor = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch('http://localhost:3001/smart_door/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password, userId }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsDoorOn(true);
        setError('');
        alert('Cửa đã được mở!');
        navigate('/home');
      } else {
        setError(data.message || 'Có lỗi xảy ra!');
      }
    } catch (err) {
      console.error('Lỗi mở cửa:', err);
      setError('Không thể kết nối đến server!');
    }
  };

  // handleFaceAI: gọi API nhận diện khuôn mặt
  const handleFaceAI = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(`http://localhost:3001/facedata/recognize_face/${userId}`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok && data.userId != null) {
        const result = await fetch(`http://localhost:3001/user/getUser/${data.userId}`, {
          method: 'GET',
          credentials: 'include',
        });
        const data2 = await result.json();
        if (result.ok && data2.data) alert(`Nhận diện: ${data2.data.fullname}`);

        const resface = await fetch('http://localhost:3001/smart_door/accessDoorByFaceAI', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ userId }),
        });
        const dataface = await resface.json();
        if (resface.ok) {
          setIsDoorOn(true);
          setError('');
          alert('Cửa đã được mở!');
          navigate('/home');
        } else {
          setError(dataface.message || 'Có lỗi xảy ra!');
        }
      } else {
        alert('Nhận diện thất bại');
      }
    } catch (err) {
      console.error('Lỗi nhận diện:', err);
      alert('Không thể kết nối đến server!');
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordChangeError('Mật khẩu mới và xác nhận mật khẩu không khớp!');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordChangeError('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }
    setPasswordChangeError('');
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(
        'http://localhost:3001/smart_door/changeDoorPassword',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ userId: userId, currentPassword: oldPassword, newPassword }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert('Đổi mật khẩu thành công!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordChangeError('');
        setShowChangePasswordModal(false);
      } else {
        setPasswordChangeError(data.message || 'Đổi mật khẩu thất bại!');
      }
    } catch (err) {
      console.error('Lỗi khi gọi API đổi mật khẩu:', err);
      setPasswordChangeError('Không thể kết nối đến server!');
    }
  };

  const closeChangePasswordModal = () => {
    setShowChangePasswordModal(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordChangeError('');
  };

  // const handleViewImage = (image) => {
  //   setSelectedImage(image);
  //   setShowImageModal(true);
  // };

  // Xử lý nhập mật khẩu để cập nhật khuôn mặt
  const handleFacePasswordSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3001/smart_door/authorFaceAI', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ facePassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setFacePasswordError('');
        setShowFaceUpdateModal(false);
        setShowUploadFaceModal(true);
      } else {
        setFacePasswordError('Mật mã không đúng!');
        setError(data.message || 'Có lỗi xảy ra!');
      }
    } catch (err) {
      console.error('Lỗi mở cửa:', err);
      setError('Không thể kết nối đến server!');
    }
  };
  // Đóng modal nhập mật khẩu cập nhật khuôn mặt
  const closeFaceUpdateModal = () => {
    setShowFaceUpdateModal(false);
    setFacePassword('');
    setFacePasswordError('');
  };
  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };
  // Xử lý upload ảnh khuôn mặt
  const handleImageUpload = (index, e) => {
    const file = e.target.files[0]
    if (!file) return

    // 1) Tạo URL để preview
    const preview = URL.createObjectURL(file)
    setFacePreviews(prev => {
      const arr = [...prev]
      arr[index] = preview
      return arr
    })

    // 2) Lưu File để gửi
    setFaceFiles(prev => {
      const arr = [...prev]
      arr[index] = file
      return arr
    })
  }

  // Xử lý lưu ảnh khuôn mặt
  const handleSaveFaceImages = async () => {
    if (!faceFiles[0] || !faceFiles[1]) {
      alert('Vui lòng tải lên cả 2 ảnh!');
      return;
    }
    if (faceFiles[0] && faceFiles[1]) {
      try {
        const formData = new FormData()
        // upload.array('imageData', 30) => append cùng key 'imageData'
        faceFiles.forEach(file => formData.append('imageData', file))

        const userId = localStorage.getItem('userId')
        const res = await fetch(
          `http://localhost:3001/facedata/addfacedata/${userId}`,
          { method: 'POST', body: formData }
        )

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.message || 'Lỗi server')
        }
        const body = await res.json()
        alert(body.message)
        setShowUploadFaceModal(false)
        setFacePreviews([null, null])
        setFaceFiles([null, null])
      } catch (err) {
        console.error(err)
        alert('Có lỗi xảy ra khi tải ảnh lên. Vui lòng thử lại.')
      }
    } else {
      alert('Vui lòng tải lên cả 2 ảnh!');
    }
  };

  // Đóng modal upload ảnh khuôn mặt
  const closeUploadFaceModal = () => {
    setShowUploadFaceModal(false);
    setFacePreviews([null, null])
    setFaceFiles([null, null]);
  };
  // History state and pagination
  const [historyData, setHistoryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;

  // Fetch door history with pagination
  const fetchHistory = async (page) => {
    try {
      const res = await fetch(
        `http://localhost:3001/smart_door/getDoorHistory?page=${page}&limit=${pageSize}`,
        { credentials: 'include' }
      );
      const result = await res.json();
      if (res.ok && result.success) {
        console.log(result.data)
        setHistoryData(result.data);
        setTotalPages(result.totalPages);
      } else {
        console.error('Failed to load history:', result.message);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchHistory(currentPage);

    // Set up interval to re-fetch continuously (e.g., every 5 seconds)
    const intervalId = setInterval(() => fetchHistory(currentPage), 5000);

    // Cleanup on unmount or before next effect run
    return () => clearInterval(intervalId);
  }, [currentPage]);

  // Pagination controls
  const handlePrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  return (
    <main className="main-content">
      <header className="main-header">
        <h1>Smart Door Control</h1>
        <div className="search-bar">
          <input type="text" placeholder="Search for something" />
        </div>
      </header>

      <section className="door-control-section">
        {/* Door Control Form */}
        <div className="door-control-form">
          <div className="door-status-section">
            <div className="door-status">
              <span>{isDoorOn ? 'Cửa đang mở' : 'Cửa đang đóng'}</span>
              <span role="img" aria-label="door-status">{isDoorOn ? '🔓' : '🔒'}</span>
            </div>
          </div>
          <div className="password-section">
            <div className="password-input">
              <label>Nhập mật mã</label>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="******"
              />
              {error && <span className="error">{error}</span>}
            </div>
            <button onClick={handleOpenDoor} className="open-door-btn">
              Mở cửa
            </button>
          </div>
          <div className="face-ai-section">
            <img src={faceAiIcon} alt="Face AI Icon" className="face-ai-icon" />
            <button onClick={handleFaceAI} className="face-ai-btn">
              Face AI
            </button>
          </div>
          <div className="settings-section">
            <button onClick={() => setShowChangePasswordModal(true)} className="settings-btn">
              Đổi mật khẩu
            </button>
            <button onClick={() => setShowFaceUpdateModal(true)} className="settings-btn">
              Cập nhật khuôn mặt
            </button>
          </div>
        </div>

        <div className="history-section">
          <h2>Lịch sử mở cửa</h2>
          <table className="history-table">
            <thead>
              <tr>
                <th>Người mở cửa</th>
                <th>ID người mở</th>
                <th>Kiểu</th>
                <th>Ngày</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((item) => (
                <tr key={item._id}>
                  <td>{item.userID?.fullname || '---'}</td>
                  <td>{item.userID?._id || '---'}</td>
                  <td>{item.action === 'open' ? 'Nhập mật mã' : item.action === 'close' ? 'Đóng cửa' : 'Thất bại'}</td>
                  <td>{new Date(item.timestamp).toLocaleString()}</td>
                  <td>{item.action === 'failed' ? 'Thất bại' : 'Thành công'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
              ‹ Prev
            </button>
            <span>Trang {currentPage} / {totalPages}</span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
              Next ›
            </button>
          </div>
        </div>
      </section>

      {showImageModal && (
        <div className="modal-overlay">
          <div className="image-modal">
            <img src={selectedImage} alt="Person" className="modal-image" />
            <button className="close-modal-btn" onClick={closeImageModal}>
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Modal hiển thị ảnh */}
      {showImageModal && (
        <div className="modal-overlay">
          <div className="image-modal">
            <img src={selectedImage} alt="Person" className="modal-image" />
            <button className="close-modal-btn" onClick={closeImageModal}>
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Modal đổi mật khẩu */}
      {showChangePasswordModal && (
        <div className="modal-overlay">
          <div className="change-password-modal">
            <h2>Đổi mật khẩu</h2>
            <div className="password-fields">
              <label>Mật khẩu cũ</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Nhập mật khẩu cũ"
              />
              <label>Mật khẩu mới</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
              />
              <label>Xác nhận mật khẩu</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Xác nhận mật khẩu mới"
              />
              {passwordChangeError && <span className="error">{passwordChangeError}</span>}
            </div>
            <div className="modal-buttons">
              <button onClick={handleChangePassword} className="save-password-btn">
                Lưu
              </button>
              <button onClick={closeChangePasswordModal} className="cancel-password-btn">
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal nhập mật khẩu để cập nhật khuôn mặt */}
      {showFaceUpdateModal && (
        <div className="modal-overlay">
          <div className="face-update-modal">
            <h2>Xác nhận mật khẩu</h2>
            <div className="password-fields">
              <label>Nhập mật khẩu cửa hiện tại</label>
              <input
                type="password"
                value={facePassword}
                onChange={(e) => setFacePassword(e.target.value)}
                placeholder="******"
              />
              {facePasswordError && <span className="error">{facePasswordError}</span>}
            </div>
            <div className="modal-buttons">
              <button onClick={handleFacePasswordSubmit} className="save-password-btn">
                Xác nhận
              </button>
              <button onClick={closeFaceUpdateModal} className="cancel-password-btn">
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal upload ảnh khuôn mặt */}
      {showUploadFaceModal && (
        <div className="modal-overlay">
          <div className="upload-face-modal">
            <h2>Cập nhật khuôn mặt</h2>
            <div className="upload-image-section">
              <div className="image-upload">
                <label>Hình ảnh 1</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(0, e)}
                />
                {facePreviews[0] && (
                  <img src={facePreviews[0]} alt="Face 1" className="preview-image" />
                )}
              </div>
              <div className="image-upload">
                <label>Hình ảnh 2</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(1, e)}
                />
                {facePreviews[1] && (
                  <img src={facePreviews[1]} alt="Face 2" className="preview-image" />
                )}
              </div>
            </div>
            <div className="modal-buttons">
              <button onClick={handleSaveFaceImages} className="save-password-btn">
                Lưu
              </button>
              <button onClick={closeUploadFaceModal} className="cancel-password-btn">
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Door;
