// Simple Messaging Component
// Send and receive messages between registered users

import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, User, Loader } from 'lucide-react';
import axios from 'axios';

function SimpleMessaging() {
  // State
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Backend API URL
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

  // Load users on mount
  useEffect(() => {
    loadUsers();
    
    // Get current user from localStorage (from login)
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUserId(user.id);
      } catch (err) {
        console.error('Error parsing user:', err);
      }
    }

    // Refresh messages every 2 seconds
    const interval = setInterval(() => {
      if (selectedUser && currentUserId) {
        loadMessages(selectedUser.id);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedUser, currentUserId]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load all users
  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/users/all`);
      if (response.data) {
        setUsers(response.data);
      }
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load messages with selected user
  const loadMessages = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await axios.get(`${API_URL}/messages/conversation/${userId}`, {
        headers: {
          'Authorization': token
        }
      });

      if (response.data) {
        setMessages(response.data);
      }
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageText.trim() || !selectedUser || !currentUserId) {
      return;
    }

    setSending(true);

    try {
      const response = await axios.post(`${API_URL}/messages/send`, {
        senderId: currentUserId,
        receiverId: selectedUser.id,
        content: messageText,
        messageType: 'TEXT'
      });

      if (response.data) {
        // Add message to list
        setMessages([...messages, response.data]);
        setMessageText('');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Make sure backend is running.');
    } finally {
      setSending(false);
    }
  };

  // Format time
  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  // Get user display name
  const getUserName = (user) => {
    return user.username || user.email || `User ${user.id}`;
  };

  if (!currentUserId) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg border border-gray-700">
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">Please login first to use messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg border border-gray-700">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-6 h-6 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Messages</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-96">
        {/* Users List */}
        <div className="md:col-span-1 bg-gray-700 rounded-lg border border-gray-600 overflow-y-auto">
          <div className="p-4 border-b border-gray-600">
            <h3 className="text-lg font-semibold text-white">Users</h3>
            <p className="text-xs text-gray-400 mt-1">{users.length} registered</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader className="w-6 h-6 text-blue-400 animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              <p>No users registered yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    setSelectedUser(user);
                    loadMessages(user.id);
                  }}
                  className={`w-full text-left px-4 py-3 transition-colors border-l-4 ${
                    selectedUser?.id === user.id
                      ? 'bg-blue-600 border-blue-400 text-white'
                      : 'bg-gray-700 border-transparent text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{getUserName(user)}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="md:col-span-2 bg-gray-700 rounded-lg border border-gray-600 flex flex-col">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-600">
                <h3 className="text-lg font-semibold text-white">{getUserName(selectedUser)}</h3>
                <p className="text-xs text-gray-400">{selectedUser.email}</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.senderId === currentUserId
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-600 text-gray-100'
                        }`}
                      >
                        <p className="break-words">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-1">{formatTime(msg.createdAt)}</p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-600">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    disabled={sending}
                    className="flex-1 px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={sending || !messageText.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    {sending ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a user to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-4 p-4 bg-blue-900 border border-blue-700 rounded-lg text-blue-200 text-sm">
        <p className="font-semibold mb-2">💬 How to Use</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Select a user from the left list</li>
          <li>Type your message in the input field</li>
          <li>Click Send or press Enter</li>
          <li>Messages sync every 2 seconds</li>
          <li>All messages saved to database</li>
        </ul>
      </div>
    </div>
  );
}

export default SimpleMessaging;
