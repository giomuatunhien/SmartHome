import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Account.css';

const Account = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  // Form state, replacing address/city with phone/role
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '********',
    //dob: '',
    phone: '',
    role: ''
  });
  const [avatar, setAvatar] = useState('../../img/avatar.jpg');
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  useEffect(() => {
    const savedAvatar = localStorage.getItem('avatar');
    const savedEmail = localStorage.getItem('email');
    const savedPhone = localStorage.getItem('phone');
    const savedName = localStorage.getItem('user');
    const savedRole = localStorage.getItem('role');

    if (savedAvatar) {
      setAvatar(savedAvatar); // Lấy avatar từ localStorage
    }

    // Lấy các thông tin khác từ localStorage
    setFormData({
      name: savedName || '',
      email: savedEmail || '',
      password: '********', // Giữ password mặc định
      phone: savedPhone || '',
      role: savedRole || ''
    });
  }, []);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const [selectedFile, setSelectedFile] = useState(null);
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result);
        setShowAvatarModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId'); // dùng lại cái getUserId() đã có
    if (!userId) {
      alert('Không tìm thấy user ID!');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('fullname', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('phone', formData.phone);
    //formDataToSend.append('role', formData.role);

    // Nếu người dùng vừa chọn file ảnh mới
    if (selectedFile) {
      formDataToSend.append('imageData', selectedFile); // key này tùy backend bạn expect
    }

    try {
      const res = await fetch(`http://localhost:3001/user/updateUser/${userId}`, {
        method: 'PUT',
        credentials: 'include',
        body: formDataToSend,
      });

      if (res.ok) {
        alert('Thông tin đã được lưu!');
        if (selectedFile) {
          const reader = new FileReader();
          reader.onload = () => {
            localStorage.setItem('avatar', reader.result);  // <-- 🪄 lưu thẳng ảnh mới
          };
          reader.readAsDataURL(selectedFile);
        }
        // Cập nhật các thông tin còn lại vào localStorage
        localStorage.setItem('user', formData.name);
        localStorage.setItem('email', formData.email);
        localStorage.setItem('phone', formData.phone);
        //localStorage.setItem('role', formData.role);
        navigate('/home');
      } else {
        const errorData = await res.json();
        alert('Cập nhật thất bại: ' + errorData.message);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
      alert('Lỗi kết nối server!');
    }
  };

  return (
    <main className="main-content">
      <header className="main-header">
        <h1>Account Management</h1>
        <div className="search-bar">
          <input type="text" placeholder="Search for something" />
        </div>
      </header>

      <section className="account-section">
        <h2>Edit Profile</h2>
        <div className="account-form">
          <div className="avatar-container">
            <img src={avatar} alt="User Avatar" className="avatar" />
            <button className="edit-avatar-btn" onClick={() => setShowAvatarModal(true)}>✏️</button>
          </div>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>Your Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleInputChange} />
            </div>
            {/* <div className="form-group">
              <label>Date of Birth</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} />
            </div> */}
            <div className="form-group">
              <label>Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Role</label>
              <input type="text" name="role" value={formData.role} onChange={handleInputChange} />
            </div>
            <button type="submit" className="save-btn">Save</button>
          </form>
        </div>
      </section>

      {showAvatarModal && (
        <div className="modal-overlay">
          <div className="avatar-modal">
            <h3>Change Avatar</h3>
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="avatar-input" />
            <button className="cancel-btn" onClick={() => setShowAvatarModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Account;
