// Share Feature Component
// Share tasks, notes, content with specific users

import React, { useState, useEffect } from 'react';
import { Share2, X, Check, AlertCircle, User, Mail } from 'lucide-react';
import axios from 'axios';

function ShareFeature({ item, itemType = 'task', onClose, onShare }) {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchText, setSearchText] = useState('');

  // Backend API URL
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

  // Load users
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/all`, {
        timeout: 5000
      });
      if (response.data) {
        setAllUsers(response.data);
      }
    } catch (err) {
      console.error('Error loading users:', err);
      // Fallback to localStorage
      const saved = localStorage.getItem('registeredUsers');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setAllUsers(parsed);
          } else {
            setAllUsers(Object.values(parsed));
          }
        } catch (e) {
          console.error('Error parsing saved users:', e);
        }
      }
    }
  };

  // Filter users based on search
  const filteredUsers = allUsers.filter(user => {
    const username = (user.username || user.name || '').toLowerCase();
    const email = (user.email || '').toLowerCase();
    const search = searchText.toLowerCase();
    return (username.includes(search) || email.includes(search)) && 
           !selectedUsers.some(u => u.id === user.id);
  });

  // Toggle user selection
  const toggleUserSelection = (user) => {
    if (selectedUsers.some(u => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  // Remove selected user
  const removeSelectedUser = (userId) => {
    setSelectedUsers(selectedUsers.filter(u => u.id !== userId));
  };

  // Share item
  const handleShare = async () => {
    if (selectedUsers.length === 0) {
      setError('Please select at least one user to share with');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Create share record for each user
      const sharePromises = selectedUsers.map(user => {
        return axios.post(`${API_URL}/share`, {
          itemId: item.id,
          itemType: itemType,
          itemData: item,
          sharedBy: localStorage.getItem('currentUser'),
          sharedWith: user.id,
          sharedAt: new Date().toISOString()
        }, {
          timeout: 5000
        }).catch(err => {
          // Fallback to localStorage
          const shareKey = `shares_${user.id}`;
          const existing = JSON.parse(localStorage.getItem(shareKey) || '[]');
          existing.push({
            itemId: item.id,
            itemType: itemType,
            itemData: item,
            sharedBy: localStorage.getItem('currentUser'),
            sharedWith: user.id,
            sharedAt: new Date().toISOString()
          });
          localStorage.setItem(shareKey, JSON.stringify(existing));
          return { data: { success: true } };
        });
      });

      await Promise.all(sharePromises);

      setSuccess(`✅ Shared with ${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''}!`);
      
      if (onShare) {
        onShare(selectedUsers);
      }

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error sharing:', err);
      setError('Failed to share. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            <h2 className="text-lg font-bold text-white">
              Share {itemType}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-900 border border-red-700 rounded-lg text-red-200 text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 bg-green-900 border border-green-700 rounded-lg text-green-200 text-sm flex items-start gap-2">
              <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Item Info */}
          <div className="p-3 bg-gray-700 rounded-lg border border-gray-600">
            <p className="text-xs text-gray-400 mb-1">Sharing:</p>
            <p className="text-white font-semibold truncate">
              {item.title || item.text || item.name || 'Item'}
            </p>
            {item.description && (
              <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                {item.description}
              </p>
            )}
          </div>

          {/* Search Users */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Search Users
            </label>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Type username or email..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-300 mb-2">
                Selected ({selectedUsers.length})
              </p>
              <div className="space-y-2">
                {selectedUsers.map(user => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 bg-blue-900 border border-blue-700 rounded-lg"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <User className="w-4 h-4 text-blue-300 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {user.username || user.name}
                        </p>
                        <p className="text-xs text-blue-200 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeSelectedUser(user.id)}
                      className="text-blue-300 hover:text-red-400 transition-colors flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Users */}
          <div>
            <p className="text-sm font-semibold text-gray-300 mb-2">
              Available Users
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">
                  {searchText ? 'No users found' : 'All users selected'}
                </p>
              ) : (
                filteredUsers.map(user => (
                  <button
                    key={user.id}
                    onClick={() => toggleUserSelection(user)}
                    className="w-full p-2 text-left bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg transition-colors flex items-center gap-3"
                  >
                    <div className="w-4 h-4 border border-gray-400 rounded flex items-center justify-center flex-shrink-0">
                      {selectedUsers.some(u => u.id === user.id) && (
                        <Check className="w-3 h-3 text-blue-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {user.username || user.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-700 border-t border-gray-600 p-4 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleShare}
            disabled={loading || selectedUsers.length === 0}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin">⏳</div>
                Sharing...
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                Share
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShareFeature;
