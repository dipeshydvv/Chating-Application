// User Registration Manager with Real-Time Sync
// This version syncs user data across devices in real-time

import React, { useState, useEffect } from 'react';
import { Users, Check, AlertCircle, Trash2, RefreshCw } from 'lucide-react';
import { useAllUsers } from '../hooks/useRealtimeSync';

function UserRegistrationManager() {
  // Real-time sync hook for all users
  const { data: firebaseUsers, loading, error, updateData, addData } = useAllUsers();
  
  // Local state
  const [registeredUsers, setRegisteredUsers] = useState({});
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('register');

  // Sync Firebase data with local state
  useEffect(() => {
    if (firebaseUsers && typeof firebaseUsers === 'object') {
      setRegisteredUsers(firebaseUsers);
    }
  }, [firebaseUsers]);

  // Also sync with localStorage as backup
  useEffect(() => {
    const saved = localStorage.getItem('registeredUsers');
    if (saved) {
      try {
        const localUsers = JSON.parse(saved);
        setRegisteredUsers(prev => ({ ...prev, ...localUsers }));
      } catch (err) {
        console.error('Error parsing localStorage:', err);
      }
    }
  }, []);

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (registeredUsers[formData.username]) {
      newErrors.username = 'Username already registered';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      registeredAt: new Date().toISOString(),
      status: 'active'
    };

    try {
      // Update Firebase
      await addData(formData.username, userData);

      // Update localStorage as backup
      const updated = { ...registeredUsers, [formData.username]: userData };
      setRegisteredUsers(updated);
      localStorage.setItem('registeredUsers', JSON.stringify(updated));

      // Show success
      setSuccessMessage(`✅ ${formData.username} registered successfully!`);
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Registration error:', err);
      setErrors({ submit: 'Failed to register user. Please try again.' });
    }
  };

  // Handle delete
  const handleDelete = async (username) => {
    if (window.confirm(`Delete ${username}?`)) {
      try {
        // Update Firebase
        const updated = { ...registeredUsers };
        delete updated[username];
        await updateData(updated);

        // Update localStorage
        setRegisteredUsers(updated);
        localStorage.setItem('registeredUsers', JSON.stringify(updated));

        setSuccessMessage(`✅ ${username} deleted successfully!`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        console.error('Delete error:', err);
        setErrors({ submit: 'Failed to delete user.' });
      }
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    // Force refresh from Firebase
    window.location.reload();
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-green-400" />
          <h2 className="text-2xl font-bold text-white">User Registration</h2>
        </div>
        <button
          onClick={handleRefresh}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          title="Refresh from server"
        >
          <RefreshCw className="w-5 h-5 text-gray-300" />
        </button>
      </div>

      {/* Status Indicator */}
      <div className="mb-4 p-3 bg-blue-900 border border-blue-700 rounded-lg text-blue-200 text-sm">
        {loading ? (
          '⏳ Syncing with server...'
        ) : error ? (
          `⚠️ Sync error: ${error}`
        ) : (
          '✅ Real-time sync active'
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('register')}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'register'
              ? 'text-green-400 border-b-2 border-green-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Register New User
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'list'
              ? 'text-green-400 border-b-2 border-green-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Registered Users ({Object.keys(registeredUsers).length})
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-900 border border-green-700 rounded-lg text-green-200 text-sm flex items-center gap-2">
          <Check size={16} />
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {errors.submit && (
        <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-lg text-red-200 text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          {errors.submit}
        </div>
      )}

      {/* Register Tab */}
      {activeTab === 'register' && (
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Username (3+ characters)
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="Enter username"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.username && (
              <p className="text-red-400 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Enter email"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Password (6+ characters)
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Enter password"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              placeholder="Confirm password"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            {loading ? 'Registering...' : 'Register User'}
          </button>
        </form>
      )}

      {/* List Tab */}
      {activeTab === 'list' && (
        <div className="space-y-3">
          {Object.keys(registeredUsers).length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No registered users yet. Register one to get started!
            </p>
          ) : (
            Object.entries(registeredUsers).map(([username, user]) => (
              <div
                key={username}
                className="p-4 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-650 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">✅</span>
                      <p className="font-semibold text-green-400">{username}</p>
                    </div>
                    <p className="text-sm text-gray-300">📧 {user.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      📅 {new Date(user.registeredAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(username)}
                    className="p-2 hover:bg-red-600 rounded-lg transition-colors text-red-400 hover:text-white"
                    title="Delete user"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-900 border border-blue-700 rounded-lg text-blue-200 text-sm">
        <p className="font-semibold mb-2">ℹ️ Real-Time Sync Active</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Data syncs automatically across devices</li>
          <li>Changes appear instantly for all users</li>
          <li>Data backed up to Firebase</li>
          <li>Local backup in browser storage</li>
        </ul>
      </div>
    </div>
  );
}

export default UserRegistrationManager;
