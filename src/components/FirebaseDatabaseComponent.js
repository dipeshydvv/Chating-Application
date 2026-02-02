// Firebase Realtime Database Component
// Store and sync user data in real-time

import React, { useState, useEffect } from 'react';
import { database } from '../config/firebaseConfig';
import { ref, set, get, onValue, remove, update } from 'firebase/database';
import { Database, Plus, Trash2, RefreshCw, Users } from 'lucide-react';

function FirebaseDatabaseComponent() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  // Load users from Firebase Realtime Database
  useEffect(() => {
    setSyncing(true);
    const usersRef = ref(database, 'users');
    
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key]
        }));
        setUsers(userList);
      } else {
        setUsers([]);
      }
      setSyncing(false);
      setLastSync(new Date());
    }, (error) => {
      console.error('Error loading users:', error);
      setSyncing(false);
    });

    return unsubscribe;
  }, []);

  // Add user to Firebase
  const handleAddUser = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !email.trim()) {
      alert('❌ Please fill username and email');
      return;
    }

    setLoading(true);

    try {
      const userId = Date.now().toString();
      const userRef = ref(database, `users/${userId}`);
      
      await set(userRef, {
        username: username.trim(),
        email: email.trim(),
        phone: phone.trim() || 'Not provided',
        createdAt: new Date().toISOString(),
        status: 'active'
      });

      setUsername('');
      setEmail('');
      setPhone('');
      alert('✅ User added to Firebase!');
    } catch (err) {
      console.error('Error adding user:', err);
      alert('❌ Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete user from Firebase
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const userRef = ref(database, `users/${userId}`);
        await remove(userRef);
        alert('✅ User deleted!');
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('❌ Error: ' + err.message);
      }
    }
  };

  // Refresh users
  const handleRefresh = async () => {
    setSyncing(true);
    try {
      const usersRef = ref(database, 'users');
      const snapshot = await get(usersRef);
      const data = snapshot.val();
      if (data) {
        const userList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key]
        }));
        setUsers(userList);
      }
      setLastSync(new Date());
      alert('✅ Refreshed from Firebase!');
    } catch (err) {
      console.error('Error refreshing:', err);
      alert('❌ Error: ' + err.message);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg border border-gray-700 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Database className="w-6 h-6 text-orange-400" />
          <h2 className="text-2xl font-bold text-white">🔥 Firebase Realtime DB</h2>
        </div>
        <button
          onClick={handleRefresh}
          disabled={syncing}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          title="Refresh from Firebase"
        >
          <RefreshCw className={`w-5 h-5 text-gray-300 ${syncing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Sync Status */}
      <div className={`mb-4 p-3 rounded-lg text-sm border flex items-center gap-2 ${
        syncing
          ? 'bg-blue-900 border-blue-700 text-blue-200'
          : 'bg-green-900 border-green-700 text-green-200'
      }`}>
        <span>{syncing ? '⏳ Syncing...' : '✅ Synced'}</span>
        {lastSync && (
          <span className="text-xs opacity-75">
            Last sync: {lastSync.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Add User Form */}
      <form onSubmit={handleAddUser} className="mb-6 p-4 bg-gray-700 rounded-lg space-y-3 border border-gray-600">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add New User
        </h3>

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username (required)"
          disabled={loading}
          className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email (required)"
          disabled={loading}
          className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
        />

        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone (optional)"
          disabled={loading}
          className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={loading || syncing}
          className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {loading ? 'Adding...' : 'Add User'}
        </button>
      </form>

      {/* Users List */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Registered Users ({users.length})
        </h3>
        
        {users.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No users yet. Add one to get started!</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {users.map((user) => (
              <div
                key={user.id}
                className="p-4 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-650 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">👤</span>
                      <p className="font-semibold text-orange-400">{user.username}</p>
                      {user.status === 'active' && (
                        <span className="text-xs bg-green-900 text-green-200 px-2 py-1 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-300">
                        📧 <span className="text-gray-400">{user.email}</span>
                      </p>
                      {user.phone && user.phone !== 'Not provided' && (
                        <p className="text-gray-300">
                          📱 <span className="text-gray-400">{user.phone}</span>
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        📅 {new Date(user.createdAt).toLocaleDateString()} {new Date(user.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="p-2 hover:bg-red-600 rounded-lg transition-colors text-red-400 hover:text-white"
                    title="Delete user"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-orange-900 border border-orange-700 rounded-lg text-orange-200 text-sm">
        <p className="font-semibold mb-2">🔥 Firebase Realtime Database Features</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>✅ Data syncs in real-time across all devices</li>
          <li>✅ Works offline and syncs when online</li>
          <li>✅ No backend server needed</li>
          <li>✅ Data stored securely in cloud</li>
          <li>✅ Automatic backups</li>
          <li>✅ Scales automatically</li>
        </ul>
      </div>
    </div>
  );
}

export default FirebaseDatabaseComponent;
