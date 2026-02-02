import React, { useState, useEffect } from 'react';
import { Mail, Phone, ArrowRight, Loader, CheckCircle, X, Eye, EyeOff } from 'lucide-react';

function OTPLoginSystem({ onLoginSuccess }) {
  const [step, setStep] = useState('method'); // method, register, login, otp, password
  const [loginMethod, setLoginMethod] = useState('email'); // email or phone
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [isNewUser, setIsNewUser] = useState(false);

  // OTP Timer
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  // Generate random OTP
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Validate email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate phone number
  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };

  // Validate password
  const validatePassword = (pwd) => {
    return pwd.length >= 6;
  };

  // Get all users from localStorage
  const getAllUsers = () => {
    return JSON.parse(localStorage.getItem('otpLoginUsers') || '[]');
  };

  // Save users to localStorage
  const saveUsers = (users) => {
    localStorage.setItem('otpLoginUsers', JSON.stringify(users));
  };

  // Check if user exists
  const userExists = (email, phone) => {
    const users = getAllUsers();
    return users.some(u => u.email === email || u.phone === phone);
  };

  // Send OTP (Simulated)
  const sendOTP = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const identifier = loginMethod === 'email' ? email : phoneNumber;

      if (loginMethod === 'email' && !validateEmail(email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      if (loginMethod === 'phone' && !validatePhone(phoneNumber)) {
        setError('Please enter a valid 10-digit phone number');
        setLoading(false);
        return;
      }

      // Generate OTP
      const newOtp = generateOTP();
      setGeneratedOtp(newOtp);

      // Simulate sending OTP
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check if user exists
      const exists = userExists(email, phoneNumber);
      setIsNewUser(!exists);

      setOtpSent(true);
      setOtpTimer(120); // 2 minutes
      setSuccess(`OTP sent to your ${loginMethod}! OTP: ${newOtp}`);
      setStep('otp');
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOTP = async () => {
    setError('');
    setSuccess('');

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    if (otp !== generatedOtp) {
      setError('Invalid OTP. Please try again.');
      return;
    }

    setSuccess('OTP verified successfully!');

    if (isNewUser) {
      // New user - go to registration
      setTimeout(() => {
        setStep('register');
      }, 1000);
    } else {
      // Existing user - go to password
      setTimeout(() => {
        setStep('password');
      }, 1000);
    }
  };

  // Register new user
  const registerUser = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!username.trim()) {
        setError('Please enter a username');
        setLoading(false);
        return;
      }

      if (username.length < 3) {
        setError('Username must be at least 3 characters');
        setLoading(false);
        return;
      }

      if (!validatePassword(password)) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      // Check if username already exists
      const users = getAllUsers();
      if (users.some(u => u.username === username)) {
        setError('Username already taken');
        setLoading(false);
        return;
      }

      // Create new user
      const newUser = {
        id: Date.now(),
        username: username,
        email: email,
        phone: phoneNumber,
        password: password, // In production, hash this!
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      users.push(newUser);
      saveUsers(users);

      setSuccess('Account created successfully!');
      
      // Save current user
      localStorage.setItem('userAddress', username);
      localStorage.setItem('currentUserData', JSON.stringify(newUser));

      setTimeout(() => {
        onLoginSuccess(username);
      }, 1500);
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Login with password
  const loginWithPassword = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!validatePassword(password)) {
        setError('Please enter a password');
        setLoading(false);
        return;
      }

      const users = getAllUsers();
      const identifier = loginMethod === 'email' ? email : phoneNumber;
      
      const user = users.find(u => 
        (u.email === email || u.phone === phoneNumber) && u.password === password
      );

      if (!user) {
        setError('Invalid password');
        setLoading(false);
        return;
      }

      // Update last login
      user.lastLogin = new Date().toISOString();
      saveUsers(users);

      setSuccess('Login successful!');
      
      // Save current user
      localStorage.setItem('userAddress', user.username);
      localStorage.setItem('currentUserData', JSON.stringify(user));

      setTimeout(() => {
        onLoginSuccess(user.username);
      }, 1500);
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setStep('method');
    setEmail('');
    setPhoneNumber('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setOtp('');
    setError('');
    setSuccess('');
    setOtpSent(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-full mb-4">
            <Phone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Quick Connect</h1>
          <p className="text-gray-400">Secure OTP-Based Login</p>
        </div>

        {/* Main Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-700">
          {/* Step 1: Choose Method */}
          {step === 'method' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white text-center">Choose Login Method</h2>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setLoginMethod('email');
                    setStep('login');
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-3"
                >
                  <Mail className="w-5 h-5" />
                  Login with Email
                </button>

                <button
                  onClick={() => {
                    setLoginMethod('phone');
                    setStep('login');
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-3"
                >
                  <Phone className="w-5 h-5" />
                  Login with Phone
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-900 text-gray-400">OR</span>
                </div>
              </div>

              <p className="text-center text-gray-400 text-sm">
                New to Quick Connect? Choose email or phone to get started
              </p>
            </div>
          )}

          {/* Step 2: Enter Email/Phone */}
          {step === 'login' && (
            <div className="space-y-6">
              <button
                onClick={() => setStep('method')}
                className="text-gray-400 hover:text-white text-sm flex items-center gap-1 mb-4"
              >
                ← Back
              </button>

              <h2 className="text-2xl font-bold text-white text-center">
                {loginMethod === 'email' ? 'Enter Email' : 'Enter Phone Number'}
              </h2>

              {loginMethod === 'email' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                  <div className="flex gap-2">
                    <div className="flex items-center px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-gray-400">
                      +91
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="9876543210"
                      maxLength="10"
                      className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={sendOTP}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Send OTP
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step 3: Verify OTP */}
          {step === 'otp' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white text-center">Verify OTP</h2>
              <p className="text-gray-400 text-center text-sm">
                Enter the 6-digit OTP sent to your {loginMethod}
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">OTP Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength="6"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-center text-2xl tracking-widest"
                />
              </div>

              {otpTimer > 0 && (
                <p className="text-center text-gray-400 text-sm">
                  Resend OTP in {otpTimer}s
                </p>
              )}

              {otpTimer === 0 && otpSent && (
                <button
                  onClick={sendOTP}
                  className="w-full text-blue-400 hover:text-blue-300 text-sm font-semibold"
                >
                  Resend OTP
                </button>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <p className="text-green-400 text-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {success}
                  </p>
                </div>
              )}

              <button
                onClick={verifyOTP}
                disabled={loading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify OTP
                    <CheckCircle className="w-5 h-5" />
                  </>
                )}
              </button>

              <button
                onClick={() => setStep('login')}
                className="w-full text-gray-400 hover:text-white text-sm font-semibold py-2"
              >
                ← Change {loginMethod === 'email' ? 'Email' : 'Phone'}
              </button>
            </div>
          )}

          {/* Step 4: Register (New User) */}
          {step === 'register' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white text-center">Create Account</h2>
              <p className="text-gray-400 text-center text-sm">
                {loginMethod === 'email' ? email : `+91 ${phoneNumber}`}
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                <p className="text-xs text-gray-500 mt-1">Min 3 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Min 6 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <p className="text-green-400 text-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {success}
                  </p>
                </div>
              )}

              <button
                onClick={registerUser}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step 5: Login with Password */}
          {step === 'password' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white text-center">Enter Password</h2>
              <p className="text-gray-400 text-center text-sm">
                {loginMethod === 'email' ? email : `+91 ${phoneNumber}`}
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <p className="text-green-400 text-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {success}
                  </p>
                </div>
              )}

              <button
                onClick={loginWithPassword}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    Login
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <button
                onClick={() => setStep('login')}
                className="w-full text-gray-400 hover:text-white text-sm font-semibold py-2"
              >
                ← Use Different {loginMethod === 'email' ? 'Email' : 'Phone'}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-xs">
          <p>Secure OTP-based authentication • Your data is encrypted</p>
        </div>
      </div>
    </div>
  );
}

export default OTPLoginSystem;
