import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Menu.css';
//import avatarImage from '../../img/avatar.jpg';
import homeIcon from '../../img/home.png';
import doorIcon from '../../img/door.png';
import enviIcon from '../../img/envi.png';
import voiceIcon from '../../img/voice.png';
import logoutIcon from '../../img/logout.png';
const Menu = ({ setIsLoggedIn }) => {
  const [avatar, setAvatar] = useState('../../img/avatar.jpg');
  const [role, setRole] = useState('admin');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAvatar = async () => {
      const savedAvatar = localStorage.getItem('avatar');
      // const savedEmail = localStorage.getItem('email');
      // const savedPhone = localStorage.getItem('phone');

      if (savedAvatar) {
        // Nếu đã có avatar, email và phone trong localStorage, thì sử dụng chúng
        setAvatar(savedAvatar);
        return; // Không cần fetch nữa
      }

      const userId = localStorage.getItem('userId');
      if (!userId) return;

      fetch(`http://localhost:3001/user/getUser/${userId}`, {
        method: 'GET',
        credentials: 'include',
      })
        .then(res => res.json())
        .then(result => {
          const user = result.data || {};
          const email = user.email || '';
          const phone = user.phone || '';

          // Lưu vào localStorage
          localStorage.setItem('email', email);
          localStorage.setItem('phone', phone);

          if (user.imageData && user.imageData.data) {
            const byteArray = new Uint8Array(user.imageData.data.data || user.imageData.data);
            const base64String = btoa(
              byteArray.reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            const avatarBase64String = `data:${user.imageData.contentType};base64,${base64String}`;
            setAvatar(avatarBase64String);
            localStorage.setItem('avatar', avatarBase64String);
          }
          setRole(localStorage.getItem("role"))
        })
        .catch(err => console.error('Failed to fetch user:', err));
    };

    fetchUserAvatar();
  }, []);


  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3001/user/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        //localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
        localStorage.removeItem("avatar");
        localStorage.removeItem("email"); // Xóa email
        localStorage.removeItem("phone"); // Xóa phone
        setIsLoggedIn(false);
        console.log("Đăng xuất thành công!");
      } else {
        console.error("Đăng xuất thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  const handleAvatarClick = () => {
    navigate('/account');
  };

  return (
    <aside className="sidebar">
      <div className="user-info">
        <img
          src={avatar}
          alt="User Avatar"
          className="avatar"
          onClick={handleAvatarClick}
          style={{ cursor: 'pointer' }}
        />
        <span className="username">{role === "admin" ? "Admin" : "Member"}</span>
      </div>
      <nav className="sidebar-nav">
        <Link to="/home" className="sidebar-link">
          <img src={homeIcon} alt="Home Icon" className="sidebar-icon" /> Home
        </Link>
        <Link to="/smart-door" className="sidebar-link">
          <img src={doorIcon} alt="Door Icon" className="sidebar-icon" /> Smart Door Control
        </Link>
        <Link to="/environment" className="sidebar-link">
          <img src={enviIcon} alt="Environment Icon" className="sidebar-icon" /> Environment Monitor
        </Link>
        <Link to="/smart-voice" className="sidebar-link">
          <img src={voiceIcon} alt="Voice Icon" className="sidebar-icon" /> Smart Voice
        </Link>
        <Link to="/" onClick={handleLogout} className="sidebar-link logout-link">
          <img src={logoutIcon} alt="Logout Icon" className="sidebar-icon" /> Logout
        </Link>
      </nav>
    </aside>
  );
};

export default Menu;
