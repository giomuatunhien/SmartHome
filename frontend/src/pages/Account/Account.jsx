import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Account.css';

const Account = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: 'Charlie Reed',
    email: 'charlie.reed@gmail.com',
    password: '********',
    dob: '1990-01-25', // Định dạng YYYY-MM-DD cho input type="date"
    address: 'San Jose, California, USA',
    city: 'San Jose',
  });

  const [avatar, setAvatar] = useState('../../img/avatar.jpg');
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result);
        setShowAvatarModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert('Thông tin đã được lưu!');
    navigate('/home');
  };

  return (
    <main className="main-content">
      <header className="main-header">
        <h1>Account Management</h1>
        <div className="search-bar">
          <input type="text" placeholder="Search for something" />
        </div>
        <div className="header-icons">
          <span role="img" aria-label="settings">⚙️</span>
          <span role="img" aria-label="notifications">🔔</span>
        </div>
      </header>

      <section className="account-section">
        <h2>Edit Profile</h2>
        <div className="account-form">
          <div className="avatar-container">
            <img src={avatar} alt="User Avatar" className="avatar" />
            <button
              className="edit-avatar-btn"
              onClick={() => setShowAvatarModal(true)}
            >
              ✏️
            </button>
          </div>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Permanent Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="save-btn">
              Save
            </button>
          </form>
        </div>
      </section>

      {showAvatarModal && (
        <div className="modal-overlay">
          <div className="avatar-modal">
            <h3>Change Avatar</h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="avatar-input"
            />
            <button
              className="cancel-btn"
              onClick={() => setShowAvatarModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Account;