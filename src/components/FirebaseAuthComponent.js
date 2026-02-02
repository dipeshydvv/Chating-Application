// Firebase Authentication Component
// Sign up, sign in, and sign out with Firebase

import React, { useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { Mail, Lock, LogOut, User, Eye, EyeOff } from 'lucide-react';

function FirebaseAuthComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  // Sign up
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email.trim() || !password.trim() || !displayName.trim()) {
      setError('Please fill all fields');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: displayName
      });

      console.log('✅ User created:', userCredential.user);
      setEmail('');
      setPassword('');
      setDisplayName('');
      setIsSignUp(false);
    } catch (err) {
      console.error('Sign up error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already registered');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email format');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Sign in
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError('Please fill all fields');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ User signed in:', userCredential.user);
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error('Sign in error:', err);
      if (err.code === 'auth/user-not-found') {
        setError('User not found');
      } else if (err.code === 'auth/wrong-password') {
        setError('Wrong password');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email format');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('✅ User signed out');
    } catch (err) {
      setError(err.message);
    }
  };

  // If user is logged in
  if (user) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-green-900 to-green-800 rounded-lg border border-green-700 shadow-xl">
        <div className="text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-white mb-4">Logged In</h2>
          
          <div className="bg-green-800 rounded-lg p-4 mb-4 text-left space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-green-300" />
              <div>
                <p className="text-xs text-green-300">Name</p>
                <p className="text-white font-semibold">{user.displayName || 'No name set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-green-300" />
              <div>
                <p className="text-xs text-green-300">Email</p>
                <p className="text-white font-semibold">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs text-green-300">UID</p>
              <p className="text-white font-mono text-xs">{user.uid.substring(0, 10)}...</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // If user is not logged in
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg border border-gray-700 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">🔥 Firebase Auth</h2>
        <div className="text-3xl">🔐</div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-lg text-red-200 text-sm flex items-center gap-2">
          <span>❌</span>
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
        {/* Display Name (Sign Up Only) */}
        {isSignUp && (
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Display Name
            </label>
            <div className="flex items-center gap-2 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <User className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your name"
                className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Email Address
          </label>
          <div className="flex items-center gap-2 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
            <Mail className="w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Password
          </label>
          <div className="flex items-center gap-2 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
            <Lock className="w-4 h-4 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-300"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            {loading ? '⏳ Loading...' : isSignUp ? '📝 Sign Up' : '🔓 Sign In'}
          </button>
        </div>

        {/* Toggle Sign Up / Sign In */}
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError('');
          }}
          className="w-full text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors"
        >
          {isSignUp ? '👤 Already have account? Sign In' : '📝 Need account? Sign Up'}
        </button>
      </form>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-900 border border-blue-700 rounded-lg text-blue-200 text-xs">
        <p className="font-semibold mb-2">💡 Firebase Authentication</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Secure email/password auth</li>
          <li>User data stored in cloud</li>
          <li>Works across devices</li>
          <li>Password hashed automatically</li>
        </ul>
      </div>
    </div>
  );
}

export default FirebaseAuthComponent;
