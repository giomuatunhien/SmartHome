import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Menu from './pages/Menu/Menu';
import Home from './pages/Home/Home';
import Door from './pages/Door/Door';
import Account from './pages/Account/Account';
import Environment from './pages/Environment/Environment';
import ChartConfig from './pages/ChartConfig/ChartConfig';
import DevicesConfig from './pages/DevicesConfig/DevicesConfig';
import Voice from './pages/Voice/Voice';
import VoiceCommandList from './pages/Voice/VoiceCommandList';
import Notification from './pages/Notification/Notification';
import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDoorOn, setIsDoorOn] = useState(false);

  return (
    <Router>
      <AppContent
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        isDoorOn={isDoorOn}
        setIsDoorOn={setIsDoorOn}
      />
    </Router>
  );
};

const AppContent = ({ isLoggedIn, setIsLoggedIn, isDoorOn, setIsDoorOn }) => {
  const navigate = useNavigate();

  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  return (
    <>
      {isLoggedIn && (
        <div className="fixed-notification">
          <span
            role="img"
            aria-label="notifications"
            onClick={handleNotificationClick}
          >
            🔔
          </span>
        </div>
      )}
      <Routes>
        <Route
          path="/"
          element={
            !isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/home" />
          }
        />
        <Route
          path="/home"
          element={
            isLoggedIn ? (
              <div className="app-container">
                <Menu setIsLoggedIn={setIsLoggedIn} />
                <Home setIsLoggedIn={setIsLoggedIn} isDoorOn={isDoorOn} setIsDoorOn={setIsDoorOn} />
              </div>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/smart-door"
          element={
            isLoggedIn ? (
              <div className="app-container">
                <Menu setIsLoggedIn={setIsLoggedIn} />
                <Door setIsLoggedIn={setIsLoggedIn} isDoorOn={isDoorOn} setIsDoorOn={setIsDoorOn} />
              </div>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/account"
          element={
            isLoggedIn ? (
              <div className="app-container">
                <Menu setIsLoggedIn={setIsLoggedIn} />
                <Account setIsLoggedIn={setIsLoggedIn} />
              </div>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/environment"
          element={
            isLoggedIn ? (
              <div className="app-container">
                <Menu setIsLoggedIn={setIsLoggedIn} />
                <Environment setIsLoggedIn={setIsLoggedIn} />
              </div>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/chart-config"
          element={
            isLoggedIn ? (
              <div className="app-container">
                <Menu setIsLoggedIn={setIsLoggedIn} />
                <ChartConfig setIsLoggedIn={setIsLoggedIn} />
              </div>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/devices-config"
          element={
            isLoggedIn ? (
              <div className="app-container">
                <Menu setIsLoggedIn={setIsLoggedIn} />
                <DevicesConfig setIsLoggedIn={setIsLoggedIn} />
              </div>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/smart-voice"
          element={
            isLoggedIn ? (
              <div className="app-container">
                <Menu setIsLoggedIn={setIsLoggedIn} />
                <Voice setIsLoggedIn={setIsLoggedIn} />
              </div>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/voice-command-list"
          element={
            isLoggedIn ? (
              <div className="app-container">
                <Menu setIsLoggedIn={setIsLoggedIn} />
                <VoiceCommandList setIsLoggedIn={setIsLoggedIn} />
              </div>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            isLoggedIn ? (
              <div className="app-container">
                <Menu setIsLoggedIn={setIsLoggedIn} />
                <Notification />
              </div>
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </>
  );
};

export default App;