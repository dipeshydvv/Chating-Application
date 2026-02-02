import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './pages/SplashScreen';
import LoginSignupPage from './pages/LoginSignupPage';
import OTPLoginSystem from './components/OTPLoginSystem';
import ChatHome from './pages/ChatHome';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [userAddress, setUserAddress] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const savedAddress = localStorage.getItem('userAddress');
    if (savedAddress) {
      setUserAddress(savedAddress);
      setIsAuthenticated(true);
    }

    // Hide splash screen after 3 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (address) => {
    setUserAddress(address);
    setIsAuthenticated(true);
    localStorage.setItem('userAddress', address);
  };

  const handleLogout = () => {
    setUserAddress(null);
    setIsAuthenticated(false);
    localStorage.removeItem('userAddress');
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/home" /> : <OTPLoginSystem onLoginSuccess={handleLogin} />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/home" /> : <LoginSignupPage onLogin={handleLogin} />}
        />
        <Route
          path="/home"
          element={isAuthenticated ? <ChatHome userAddress={userAddress} onLogout={handleLogout} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
