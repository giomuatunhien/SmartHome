import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ setIsLoggedIn }) => {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Dữ liệu người dùng giả lập
  const mockUsers = {
    Admin: [{ email: 'admin@gmail.com', password: 'admin' }],
    Member: [{ email: 'member@gmail.com', password: 'member123' }],
  };

  // Xử lý khi bấm nút LOGIN
  const handleLoginClick = () => {
    setShowRoleModal(true);
  };

  // Xử lý khi chọn vai trò (Admin hoặc Member)
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setShowRoleModal(false);
    setShowLoginModal(true);
  };

  // Đóng modal đăng nhập
  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
    setSelectedRole('');
    setEmail('');
    setPassword('');
    setError('');
  };

  // Xử lý khi bấm nút Continue (mô phỏng đăng nhập)
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');

    const users = mockUsers[selectedRole] || [];
    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      // Mô phỏng lưu token và cập nhật trạng thái đăng nhập
      localStorage.setItem('token', 'mock-token'); // Token giả lập
      setIsLoggedIn(true); // Cập nhật trạng thái đăng nhập
      navigate('/home'); // Điều hướng đến trang Home
    } else {
      setError('Email hoặc mật khẩu không đúng!');
    }
  };

  return (
    <div className="login-container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <span role="img" aria-label="house">🏠</span> YOLO Home
        </div>
        <nav className="nav">
          <a href="#news">News</a>
          <a href="#about">About</a>
          <a href="#help">Help</a>
          <button className="login-btn" onClick={handleLoginClick}>
            LOGIN
          </button>
        </nav>
      </header>

      {/* Hero Section với ảnh nền */}
      <section className="hero">
        <div className="hero-background" />
      </section>

      {/* Modal chọn vai trò */}
      {showRoleModal && (
        <div className="modal-overlay">
          <div className="role-modal">
            <h2>Login as:</h2>
            <button onClick={() => handleRoleSelect('Admin')}>Admin</button>
            <button onClick={() => handleRoleSelect('Member')}>Member</button>
            <button onClick={() => setShowRoleModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Modal đăng nhập */}
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="login-modal">
            <h2>Login your account!</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleLoginSubmit}>
              <div className="input-group">
                <label>
                  <input
                    type="radio"
                    name="loginType"
                    value="email"
                    defaultChecked
                  />
                  E-mail
                </label>
                <label>
                  <input type="radio" name="loginType" value="mobile" />
                  Mobile Number
                </label>
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="input-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <a href="#forgot-password" className="forgot-password">
                Forgot password?
              </a>
              <button type="submit" className="continue-btn">
                Continue
              </button>
            </form>
            <button className="close-btn" onClick={handleCloseLoginModal}>
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-section">
          <h3>Let's Get Social</h3>
          <div className="social-links">
            <a href="#facebook">📘</a>
            <a href="#linkedin">🔗</a>
            <a href="#pinterest">📌</a>
          </div>
        </div>
        <div className="footer-section">
          <h3>About YOLO Home</h3>
          <a href="#company">Company Information</a>
          <a href="#resources">Resources</a>
          <a href="#success">Our Success</a>
        </div>
        <div className="footer-section">
          <h3>Support</h3>
          <a href="#contact">Contact Us</a>
          <a href="#newsletter">Newsletter</a>
        </div>
      </footer>
    </div>
  );
};

export default Login;