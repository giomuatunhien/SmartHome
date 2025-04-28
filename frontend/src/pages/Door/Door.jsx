import React, { useState } from 'react';
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
  const [faceImages, setFaceImages] = useState([null, null]);

  // Xử lý nhập mật mã
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError('');
  };

  // Xử lý mở cửa
  const handleOpenDoor = () => {
    if (password === '112233') {
      setIsDoorOn(true);
      setError('');
      alert('Cửa đã được mở!');
      navigate('/home');
    } else {
      setError('Mật mã không đúng!');
    }
  };

  // Dữ liệu lịch sử
  const historyData = [
    { name: 'Đậu Ngọc Quân', id: '#000001', method: 'Nhập mật mã', date: '28 Jan, 12:30 AM', status: 'Thành công', image: 'https://via.placeholder.com/100' },
    { name: 'Nguyen Van A', id: '#000002', method: 'Face AI', date: '28 Jan, 12:30 AM', status: 'Thất bại', image: 'https://via.placeholder.com/100' },
    { name: 'Nguyen Van B', id: '#000003', method: 'Nhập mật mã', date: '28 Jan, 12:30 AM', status: 'Thất bại', image: 'https://via.placeholder.com/100' },
    { name: 'Nguyen Van C', id: '#000004', method: 'Face AI', date: '28 Jan, 12:30 AM', status: 'Thành công', image: 'https://via.placeholder.com/100' },
  ];

  // Hiển thị modal ảnh
  const handleViewImage = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  // Đóng modal ảnh
  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };

  // Xử lý Face AI (cập nhật khuôn mặt)
  const handleFaceAI = () => {
    alert('Chức năng Face AI: Yêu cầu chụp ảnh từ thiết bị (chưa triển khai).');
    // Sau này có thể dùng navigator.mediaDevices.getUserMedia để chụp ảnh
  };

  // Xử lý đổi mật khẩu
  const handleChangePassword = () => {
    if (oldPassword !== '112233') {
      setPasswordChangeError('Mật khẩu cũ không đúng!');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordChangeError('Mật khẩu mới và xác nhận mật khẩu không khớp!');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordChangeError('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }
    setPasswordChangeError('');
    alert('Đổi mật khẩu thành công!');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowChangePasswordModal(false);
  };

  // Đóng modal đổi mật khẩu
  const closeChangePasswordModal = () => {
    setShowChangePasswordModal(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordChangeError('');
  };

  // Xử lý nhập mật khẩu để cập nhật khuôn mặt
  const handleFacePasswordSubmit = () => {
    if (facePassword === '112233') {
      setFacePasswordError('');
      setShowFaceUpdateModal(false);
      setShowUploadFaceModal(true);
    } else {
      setFacePasswordError('Mật mã không đúng!');
    }
  };

  // Đóng modal nhập mật khẩu cập nhật khuôn mặt
  const closeFaceUpdateModal = () => {
    setShowFaceUpdateModal(false);
    setFacePassword('');
    setFacePasswordError('');
  };

  // Xử lý upload ảnh khuôn mặt
  const handleImageUpload = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const newImages = [...faceImages];
      newImages[index] = imageUrl;
      setFaceImages(newImages);
    }
  };

  // Xử lý lưu ảnh khuôn mặt
  const handleSaveFaceImages = () => {
    if (faceImages[0] && faceImages[1]) {
      alert('Cập nhật khuôn mặt thành công!');
      setShowUploadFaceModal(false);
      setFaceImages([null, null]);
    } else {
      alert('Vui lòng tải lên cả 2 ảnh!');
    }
  };

  // Đóng modal upload ảnh khuôn mặt
  const closeUploadFaceModal = () => {
    setShowUploadFaceModal(false);
    setFaceImages([null, null]);
  };

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

        {/* History Section */}
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
                <th>Xem lại</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.id}</td>
                  <td>{item.method}</td>
                  <td>{item.date}</td>
                  <td className={item.status === 'Thành công' ? 'status-success' : 'status-fail'}>
                    {item.status}
                  </td>
                  <td>
                    <span
                      role="img"
                      aria-label="view"
                      className="view-icon"
                      onClick={() => handleViewImage(item.image)}
                    >
                      📷
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button>Previous</button>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <button>Next</button>
          </div>
        </div>
      </section>

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
                {faceImages[0] && (
                  <img src={faceImages[0]} alt="Face 1" className="preview-image" />
                )}
              </div>
              <div className="image-upload">
                <label>Hình ảnh 2</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(1, e)}
                />
                {faceImages[1] && (
                  <img src={faceImages[1]} alt="Face 2" className="preview-image" />
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