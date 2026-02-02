import React, { useState } from 'react';
import { Phone, Loader } from 'lucide-react';

function LoginPage({ onLogin }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState('phone');

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (!phoneNumber) {
        setError('Please enter phone number');
        setIsLoading(false);
        return;
      }

      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(phoneNumber)) {
        setError('Please enter a valid Indian phone number (10 digits)');
        setIsLoading(false);
        return;
      }

      const newOtp = generateOTP();
      setGeneratedOtp(newOtp);
      setStep('otp');
      setSuccess(`✅ OTP sent! Demo OTP: ${newOtp}`);
      setOtp('');
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (!otp) {
        setError('Please enter OTP');
        setIsLoading(false);
        return;
      }

      if (otp !== generatedOtp) {
        setError('Invalid OTP. Please try again.');
        setIsLoading(false);
        return;
      }

      setStep('username');
      setSuccess('✅ OTP verified! Now create your username.');
      setOtp('');
    } catch (err) {
      setError('OTP verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (!username) {
        setError('Please enter username');
        setIsLoading(false);
        return;
      }

      // Check if username already exists
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const usernameExists = registeredUsers.some(u => u.username.toLowerCase() === username.toLowerCase());
      
      if (usernameExists) {
        setError('❌ Username already taken! Please choose another.');
        setIsLoading(false);
        return;
      }

      // Simulate account creation locally
      setTimeout(() => {
        const user = {
          id: Math.random().toString(),
          username,
          phoneNumber,
          email: `${phoneNumber}@phone.local`,
          avatar: '👤',
          registeredAt: new Date().toISOString(),
          registrationType: 'phone',
        };

        // Add user to registered users list
        registeredUsers.push(user);
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

        localStorage.setItem('token', 'demo-token-' + Math.random().toString());
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userAddress', username);
        
        setSuccess('✅ Account created successfully!');
        setTimeout(() => {
          onLogin(username);
        }, 1000);
      }, 1500);
    } catch (err) {
      console.error('Signup error:', err);
      setError('Error creating account. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);

    try {
      // Simulate Google login locally
      setTimeout(() => {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const googleEmail = `user${Math.random().toString(36).slice(2, 9)}@gmail.com`;
        
        // Check if user already exists with this email
        const existingUser = registeredUsers.find(u => u.email === googleEmail);
        
        if (existingUser) {
          // User already registered, just login
          localStorage.setItem('token', 'google-token-' + Math.random().toString());
          localStorage.setItem('user', JSON.stringify(existingUser));
          localStorage.setItem('userAddress', existingUser.username);
          
          setSuccess('✅ Logged in with Google!');
          setTimeout(() => {
            onLogin(existingUser.username);
          }, 1000);
        } else {
          // New user, create account
          const mockGoogleUser = {
            id: Math.random().toString(),
            email: googleEmail,
            username: `GoogleUser${Math.floor(Math.random() * 10000)}`,
            avatar: '👤',
            registeredAt: new Date().toISOString(),
            registrationType: 'google',
          };

          registeredUsers.push(mockGoogleUser);
          localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

          localStorage.setItem('token', 'google-token-' + Math.random().toString());
          localStorage.setItem('user', JSON.stringify(mockGoogleUser));
          localStorage.setItem('userAddress', mockGoogleUser.username);
          
          setSuccess('✅ Account created with Google!');
          setTimeout(() => {
            onLogin(mockGoogleUser.username);
          }, 1000);
        }
      }, 1500);
    } catch (err) {
      console.error('Google login error:', err);
      setError('Error logging in. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8 hover:border-slate-600/50 transition-all duration-300">
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-lg">
                <Phone className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Quick Connect</h1>
            <p className="text-gray-400">Sign up or login with your phone</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm">
              {success}
            </div>
          )}

          {step === 'phone' && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  📱 Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="9876543210"
                  maxLength="10"
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                />
                <p className="text-gray-500 text-xs mt-1">Enter 10-digit Indian phone number</p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/50"
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength="6"
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-center tracking-widest text-2xl"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/50"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full py-2 px-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-gray-300 font-semibold rounded-lg transition-all duration-300"
              >
                Back
              </button>
            </form>
          )}

          {step === 'username' && (
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  👤 Create Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="your_username"
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-green-500/50"
              >
                {isLoading ? 'Creating Account...' : '✅ Create Account'}
              </button>

              <button
                type="button"
                onClick={() => setStep('otp')}
                className="w-full py-2 px-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-gray-300 font-semibold rounded-lg transition-all duration-300"
              >
                Back
              </button>
            </form>
          )}

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-700"></div>
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-slate-700"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-red-500/50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <span className="text-xl">🔴</span>
                Continue with Google
              </>
            )}
          </button>

          <p className="text-center text-gray-500 text-xs mt-6">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default LoginPage;
