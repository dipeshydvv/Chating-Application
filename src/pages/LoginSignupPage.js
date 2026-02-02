// Login/Signup Page
// Users can login to existing account or create new account

import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Eye, EyeOff, LogIn, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

function LoginSignupPage({ onLogin }) {
  // State
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState([]);

  // Backend API URL
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

  // Load registered users on mount
  useEffect(() => {
    loadRegisteredUsers();
  }, []);

  // Load users from backend
  const loadRegisteredUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/all`, {
        timeout: 5000
      });
      if (response.data) {
        setRegisteredUsers(response.data);
      }
    } catch (err) {
      console.error('Error loading users:', err);
      // Fallback to localStorage
      const saved = localStorage.getItem('registeredUsers');
      if (saved) {
        setRegisteredUsers(JSON.parse(saved));
      }
    }
  };

  // Validate login form
  const validateLoginForm = () => {
    const newErrors = [];

    if (!email.trim()) {
      newErrors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.push('Invalid email format');
    }

    if (!password.trim()) {
      newErrors.push('Password is required');
    }

    return newErrors;
  };

  // Validate signup form
  const validateSignupForm = () => {
    const newErrors = [];

    if (!username.trim()) {
      newErrors.push('Username is required');
    } else if (username.length < 3) {
      newErrors.push('Username must be at least 3 characters');
    } else {
      const userExists = registeredUsers.some(
        u => u.username && u.username.toLowerCase() === username.toLowerCase()
      );
      if (userExists) {
        newErrors.push('❌ Username already taken! Choose a different username.');
      }
    }

    if (!email.trim()) {
      newErrors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.push('Invalid email format');
    } else {
      const emailExists = registeredUsers.some(
        u => u.email && u.email.toLowerCase() === email.toLowerCase()
      );
      if (emailExists) {
        newErrors.push('❌ Email already registered! Use a different email.');
      }
    }

    if (!password.trim()) {
      newErrors.push('Password is required');
    } else if (password.length < 6) {
      newErrors.push('Password must be at least 6 characters');
    }

    if (password !== confirmPassword) {
      newErrors.push('Passwords do not match');
    }

    return newErrors;
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const errors = validateLoginForm();
    if (errors.length > 0) {
      setError(errors.join('\n'));
      return;
    }

    setLoading(true);

    try {
      // Try backend login first
      try {
        const response = await axios.post(`${API_URL}/auth/login`, {
          email: email.trim(),
          password: password.trim()
        }, {
          timeout: 5000
        });

        if (response.data && response.data.user) {
          // Store user data
          localStorage.setItem('currentUser', JSON.stringify(response.data.user));
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userAddress', response.data.user.username);

          setSuccess(`✅ Welcome back, ${response.data.user.username}!`);
          setTimeout(() => {
            onLogin(response.data.user.username);
          }, 1000);
          return;
        }
      } catch (backendErr) {
        console.log('Backend login failed, trying localStorage...');
      }

      // Fallback to localStorage
      const user = registeredUsers.find(
        u => u.email && u.email.toLowerCase() === email.toLowerCase()
      );

      if (!user) {
        setError('❌ Email not found. Please sign up first.');
        setLoading(false);
        return;
      }

      // In real app, password would be hashed. For demo, we check if it matches
      if (user.password !== password) {
        setError('❌ Invalid password. Please try again.');
        setLoading(false);
        return;
      }

      // Login successful
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('userAddress', user.username);

      setSuccess(`✅ Welcome back, ${user.username}!`);
      setTimeout(() => {
        onLogin(user.username);
      }, 1000);
    } catch (err) {
      console.error('Login error:', err);
      setError('❌ Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const errors = validateSignupForm();
    if (errors.length > 0) {
      setError(errors.join('\n'));
      return;
    }

    setLoading(true);

    try {
      // Try backend signup first
      try {
        const response = await axios.post(`${API_URL}/auth/register`, {
          username: username.trim(),
          email: email.trim(),
          password: password.trim()
        }, {
          timeout: 5000
        });

        if (response.data && response.data.user) {
          // Store user data
          localStorage.setItem('currentUser', JSON.stringify(response.data.user));
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userAddress', response.data.user.username);

          setSuccess(`✅ Account created! Welcome, ${response.data.user.username}!`);
          setTimeout(() => {
            onLogin(response.data.user.username);
          }, 1000);
          return;
        }
      } catch (backendErr) {
        console.log('Backend signup failed, using localStorage...');
      }

      // Fallback to localStorage
      const newUser = {
        id: Date.now(),
        username: username.trim(),
        email: email.trim(),
        password: password.trim(),
        createdAt: new Date().toISOString()
      };

      const updatedUsers = [...registeredUsers, newUser];
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      setRegisteredUsers(updatedUsers);

      // Store current user
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      localStorage.setItem('userAddress', newUser.username);

      setSuccess(`✅ Account created! Welcome, ${newUser.username}!`);
      setTimeout(() => {
        onLogin(newUser.username);
      }, 1000);
    } catch (err) {
      console.error('Signup error:', err);
      setError('❌ Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Main container */}
      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-center">
            <div className="text-4xl mb-3">💬</div>
            <h1 className="text-3xl font-bold text-white mb-2">QuickConnect</h1>
            <p className="text-blue-100">
              {isLogin ? 'Welcome Back!' : 'Join Us Today!'}
            </p>
          </div>

          {/* Form container */}
          <div className="p-6 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-900 border border-red-700 rounded-lg text-red-200 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="whitespace-pre-wrap">{error}</div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-4 bg-green-900 border border-green-700 rounded-lg text-green-200 text-sm flex items-start gap-3">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>{success}</div>
              </div>
            )}

            {/* Login Form */}
            {isLogin && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="flex items-center gap-3 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      disabled={loading}
                      className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="flex items-center gap-3 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500">
                    <Lock className="w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      disabled={loading}
                      className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin">⏳</div>
                      Logging in...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      Login
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Signup Form */}
            {!isLogin && (
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Username
                  </label>
                  <div className="flex items-center gap-3 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-purple-500">
                    <User className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Choose a username"
                      disabled={loading}
                      className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="flex items-center gap-3 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-purple-500">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      disabled={loading}
                      className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="flex items-center gap-3 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-purple-500">
                    <Lock className="w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password (6+ chars)"
                      disabled={loading}
                      className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="flex items-center gap-3 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-purple-500">
                    <Lock className="w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      disabled={loading}
                      className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-400 hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin">⏳</div>
                      Creating account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Sign Up
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Toggle between login and signup */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setUsername('');
              }}
              className="w-full text-blue-400 hover:text-blue-300 font-semibold py-2 transition-colors"
            >
              {isLogin ? (
                '📝 Need an account? Sign Up'
              ) : (
                '🔓 Already have an account? Login'
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="bg-gray-700 px-6 py-4 text-center text-xs text-gray-400">
            <p>
              {isLogin
                ? '✅ Login with your registered email and password'
                : '✅ Create a new account to get started'}
            </p>
          </div>
        </div>

        {/* Info box */}
        <div className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm">
          <p className="font-semibold mb-2">💡 Tips:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Use your registered email to login</li>
            <li>Password must be at least 6 characters</li>
            <li>Usernames must be unique</li>
            <li>Your data is saved permanently</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default LoginSignupPage;
