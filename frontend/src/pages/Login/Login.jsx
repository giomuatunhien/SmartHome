import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
// Import các ảnh banner
import banner1 from '../../img/banner1.jpg';
import banner2 from '../../img/banner2.jpg';
import yoloLogo from '../../img/yolo.png';
const Login = ({ setIsLoggedIn }) => {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [currentBanner, setCurrentBanner] = useState(0); // Quản lý ảnh nền hiện tại
  const navigate = useNavigate();
  // Danh sách các ảnh banner
  const banners = [banner1, banner2];
  // Dữ liệu người dùng giả lập
  // const mockUsers = {
  //   Admin: [{ email: 'admin@gmail.com', password: 'admin' }],
  //   Member: [{ email: 'member@gmail.com', password: 'member123' }],
  // };
  // Tự động chuyển đổi ảnh nền mỗi 5 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000); // Chuyển đổi mỗi 5 giây
    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, [banners.length]);
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
  // const handleLoginSubmit = (e) => {
  //   e.preventDefault();
  //   setError('');

  //   const users = mockUsers[selectedRole] || [];
  //   const user = users.find((u) => u.email === email && u.password === password);

  //   if (user) {
  //     // Mô phỏng lưu token và cập nhật trạng thái đăng nhập
  //     localStorage.setItem('token', 'mock-token'); // Token giả lập
  //     setIsLoggedIn(true); // Cập nhật trạng thái đăng nhập
  //     navigate('/home'); // Điều hướng đến trang Home
  //   } else {
  //     setError('Email hoặc mật khẩu không đúng!');
  //   }
  // };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    // Xác định endpoint API dựa trên vai trò
    const endpoint =
      selectedRole === "Admin"
        ? "http://localhost:3001/admin/login"
        : "http://localhost:3001/member/login";
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include", // 🔥 Quan trọng: gửi cookie
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        // Lưu token vào localStorage để sử dụng sau này
        //localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("user", data.user);
        localStorage.setItem("userId", data.userId);
        setIsLoggedIn(true);
        navigate("/home");
      } else {
        alert(data.message || "Invalid email or password!");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred while logging in.");
    }
  };

  // Hàm kiểm tra trạng thái đăng nhập
  // Hàm kiểm tra trạng thái đăng nhập (gọi API để xác thực token)
  const checkLoginStatus = async () => {
    try {
      const res = await fetch("http://localhost:3001/user/verifyToken", {
        method: "GET",
        credentials: "include", // Đảm bảo gửi cookie
      });

      if (!res.ok) throw new Error("Không có phiên đăng nhập");

      const data = await res.json();
      return { isLoggedIn: true, user: data.user, role: data.role };
    } catch (error) {
      return { isLoggedIn: false, user: null, role: null };
    }
  };

  // Kiểm tra trạng thái đăng nhập khi load Login.jsx
  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await checkLoginStatus();
      if (authStatus.isLoggedIn) {
        setIsLoggedIn(true);
        navigate('/home');
      }
    };
    checkAuth();
  }, [navigate, setIsLoggedIn]);


  return (
    <div className="login-container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <img src={yoloLogo} alt="YOLO Home" className="logo-img" />
          YOLO Home
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

      {/* Hero Section với ảnh nền chuyển đổi */}
      <section className="hero">
        <div
          className="hero-background"
          style={{ backgroundImage: `url(${banners[currentBanner]})` }}
        />
        <div className="hero-content">
          <h1>Welcome to YOLO Home</h1>
          <p>Control your smart home with ease and style.</p>
        </div>
      </section>

      {/* Modal chọn vai trò */}
      {showRoleModal && (
        <div className="modal-overlay">
          <div className="role-modal animate-modal">
            <h2>Login as:</h2>
            <button className="role-btn" onClick={() => handleRoleSelect('Admin')}>
              Admin
            </button>
            <button className="role-btn" onClick={() => handleRoleSelect('Member')}>
              Member
            </button>
            <button className="cancel-btn" onClick={() => setShowRoleModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Modal đăng nhập */}
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="login-modal animate-modal">
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