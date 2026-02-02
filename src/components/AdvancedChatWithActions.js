// Advanced Chat Component with Message Actions
// Pin, delete, reply with persistent menus

import React, { useState, useEffect, useRef } from 'react';
import { Send, Image, Video, Share2, X, Loader, User, Pin, Trash2 } from 'lucide-react';
import axios from 'axios';
import MessageActions from './MessageActions';
import MediaSharing from './MediaSharing';
import MediaViewer from './MediaViewer';
import UsernameAutocomplete from './UsernameAutocomplete';

function AdvancedChatWithActions() {
  // State
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [showMediaSharing, setShowMediaSharing] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const [deletedMessagesMe, setDeletedMessagesMe] = useState([]);
  const [deletedMessagesEveryone, setDeletedMessagesEveryone] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Backend API URL
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

  // Load data on mount
  useEffect(() => {
    loadUsers();
    
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
        setCurrentUserId(user.id);
      } catch (err) {
        console.error('Error parsing user:', err);
      }
    }

    // Load deleted messages
    const deletedMe = JSON.parse(localStorage.getItem('deleted_messages_me') || '[]');
    const deletedEveryone = JSON.parse(localStorage.getItem('deleted_messages_everyone') || '[]');
    setDeletedMessagesMe(deletedMe);
    setDeletedMessagesEveryone(deletedEveryone);

    // Load pinned messages
    const pinned = JSON.parse(localStorage.getItem('pinned_messages') || '[]');
    setPinnedMessages(pinned);

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

  // Load users
  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/users/all`, {
        timeout: 5000
      });
      if (response.data) {
        setUsers(response.data);
      }
    } catch (err) {
      console.error('Error loading users:', err);
      const saved = localStorage.getItem('registeredUsers');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setUsers(parsed);
          } else {
            setUsers(Object.values(parsed));
          }
        } catch (e) {
          console.error('Error parsing saved users:', e);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Load messages
  const loadMessages = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_URL}/messages/conversation/${userId}`, {
        headers: {
          'Authorization': token || ''
        },
        timeout: 5000
      });

      if (response.data) {
        setMessages(response.data);
      }
    } catch (err) {
      console.error('Error loading messages:', err);
      const key = `messages_${Math.min(currentUserId, userId)}_${Math.max(currentUserId, userId)}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        setMessages(JSON.parse(saved));
      }
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
        content: messageText.trim(),
        messageType: 'TEXT',
        replyTo: replyingTo?.id
      }, {
        timeout: 5000
      });

      if (response.data) {
        setMessages(prev => [...prev, response.data]);
        setMessageText('');
        setReplyingTo(null);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      const newMessage = {
        id: Date.now(),
        senderId: currentUserId,
        receiverId: selectedUser.id,
        content: messageText.trim(),
        messageType: 'TEXT',
        replyTo: replyingTo?.id,
        timestamp: new Date().toISOString()
      };

      const key = `messages_${Math.min(currentUserId, selectedUser.id)}_${Math.max(currentUserId, selectedUser.id)}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(newMessage);
      localStorage.setItem(key, JSON.stringify(existing));

      setMessages(prev => [...prev, newMessage]);
      setMessageText('');
      setReplyingTo(null);
    } finally {
      setSending(false);
    }
  };

  // Handle pin message
  const handlePinMessage = (message) => {
    if (!pinnedMessages.includes(message.id)) {
      const newPinned = [...pinnedMessages, message.id];
      setPinnedMessages(newPinned);
      localStorage.setItem('pinned_messages', JSON.stringify(newPinned));
    }
  };

  // Handle delete message
  const handleDeleteMessage = (messageId, deleteType) => {
    if (deleteType === 'me') {
      const newDeleted = [...deletedMessagesMe, messageId];
      setDeletedMessagesMe(newDeleted);
      localStorage.setItem('deleted_messages_me', JSON.stringify(newDeleted));
    } else {
      const newDeleted = [...deletedMessagesEveryone, messageId];
      setDeletedMessagesEveryone(newDeleted);
      localStorage.setItem('deleted_messages_everyone', JSON.stringify(newDeleted));
    }
  };

  // Handle media sent
  const handleMediaSent = (mediaMessage) => {
    setMessages(prev => [...prev, mediaMessage]);
    setShowMediaSharing(false);
  };

  // Handle reply
  const handleReply = (message) => {
    setReplyingTo(message);
    inputRef.current?.focus();
  };

  // Format time
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Check if message is deleted
  const isMessageDeleted = (msgId, isOwn) => {
    if (deletedMessagesEveryone.includes(msgId)) return true;
    if (isOwn && deletedMessagesMe.includes(msgId)) return true;
    return false;
  };

  // Check if message is media
  const isMediaMessage = (msg) => {
    return msg.messageType === 'PHOTO' || msg.messageType === 'VIDEO' || 
           msg.messageType === 'photo' || msg.messageType === 'video';
  };

  // Filter messages
  const filteredMessages = messages.filter(msg => !isMessageDeleted(msg.id, msg.senderId === currentUserId));

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Users List */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold text-white">Contacts</h2>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search..."
            className="w-full mt-2 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          ) : users.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              <p>No users yet</p>
            </div>
          ) : (
            users
              .filter(u => {
                const username = (u.username || u.name || '').toLowerCase();
                const email = (u.email || '').toLowerCase();
                const search = searchText.toLowerCase();
                return (username.includes(search) || email.includes(search)) &&
                       u.id !== currentUserId && u.username !== currentUser?.username;
              })
              .map(user => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`w-full p-4 text-left border-b border-gray-700 transition-colors ${
                    selectedUser?.id === user.id
                      ? 'bg-blue-600'
                      : 'hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <User className="w-8 h-8 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">
                        {user.username || user.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </button>
              ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="w-8 h-8 text-gray-400" />
                <div>
                  <h3 className="font-bold text-white">
                    {selectedUser.username || selectedUser.name}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {selectedUser.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Pinned Messages */}
            {pinnedMessages.length > 0 && (
              <div className="bg-blue-900 border-b border-blue-700 p-3">
                <div className="flex items-center gap-2 text-blue-200 text-sm">
                  <Pin className="w-4 h-4" />
                  <span className="font-semibold">{pinnedMessages.length} pinned message{pinnedMessages.length > 1 ? 's' : ''}</span>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {filteredMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <p>No messages yet. Start a conversation!</p>
                </div>
              ) : (
                filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.senderId === currentUserId ? 'justify-end' : 'justify-start'
                    } group`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg relative ${
                        msg.senderId === currentUserId
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-100'
                      } ${pinnedMessages.includes(msg.id) ? 'ring-2 ring-yellow-400' : ''}`}
                    >
                      {/* Reply To */}
                      {msg.replyTo && (
                        <div className={`mb-2 pb-2 border-b ${
                          msg.senderId === currentUserId
                            ? 'border-blue-400'
                            : 'border-gray-600'
                        }`}>
                          <p className="text-xs opacity-75">Replying to:</p>
                          <p className="text-sm italic opacity-75">
                            {messages.find(m => m.id === msg.replyTo)?.content || 'Message'}
                          </p>
                        </div>
                      )}

                      {/* Text Message */}
                      {msg.messageType === 'TEXT' && (
                        <p className="break-words">{msg.content}</p>
                      )}

                      {/* Photo Message */}
                      {isMediaMessage(msg) && msg.messageType === 'PHOTO' && (
                        <div
                          onClick={() => setSelectedMedia(msg)}
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          <img
                            src={msg.mediaUrl || msg.content}
                            alt="Shared photo"
                            className="max-w-xs rounded-lg"
                          />
                          <p className="text-xs mt-2 opacity-75">📸 Photo</p>
                        </div>
                      )}

                      {/* Video Message */}
                      {isMediaMessage(msg) && msg.messageType === 'VIDEO' && (
                        <div
                          onClick={() => setSelectedMedia(msg)}
                          className="cursor-pointer hover:opacity-80 transition-opacity relative"
                        >
                          <video
                            src={msg.mediaUrl || msg.content}
                            className="max-w-xs rounded-lg"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-lg">
                            <Video className="w-12 h-12 text-white" />
                          </div>
                          <p className="text-xs mt-2 opacity-75">🎥 Video</p>
                        </div>
                      )}

                      <p className="text-xs opacity-75 mt-1">
                        {formatTime(msg.createdAt || msg.timestamp)}
                      </p>

                      {/* Message Actions Button */}
                      <div className="absolute -right-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MessageActions
                          message={msg}
                          currentUserId={currentUserId}
                          onPin={handlePinMessage}
                          onDelete={handleDeleteMessage}
                          onReply={handleReply}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Preview */}
            {replyingTo && (
              <div className="bg-gray-800 border-t border-gray-700 p-3 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400">Replying to:</p>
                  <p className="text-sm text-white truncate">{replyingTo.content}</p>
                </div>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="text-gray-400 hover:text-white ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Media Sharing Panel */}
            {showMediaSharing && (
              <div className="bg-gray-800 border-t border-gray-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-white">📸 Share Media</h4>
                  <button
                    onClick={() => setShowMediaSharing(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <MediaSharing
                  currentUserId={currentUserId}
                  selectedUserId={selectedUser.id}
                  onMediaSent={handleMediaSent}
                />
              </div>
            )}

            {/* Input Area */}
            <div className="bg-gray-800 border-t border-gray-700 p-4 space-y-3">
              {/* Media Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowMediaSharing(!showMediaSharing)}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                    showMediaSharing
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  title="Share photo or video"
                >
                  <Image className="w-5 h-5" />
                  <span className="hidden sm:inline">Media</span>
                </button>
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="relative">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message... (use @ to mention users)"
                    disabled={sending}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 pr-12"
                  />

                  {/* Username Autocomplete */}
                  <UsernameAutocomplete
                    inputValue={messageText}
                    onSelect={(user) => {
                      const lastAtIndex = messageText.lastIndexOf('@');
                      const beforeAt = messageText.substring(0, lastAtIndex);
                      const newText = beforeAt + '@' + user.username + ' ';
                      setMessageText(newText);
                      inputRef.current?.focus();
                    }}
                    users={users.filter(u => u.id !== currentUserId)}
                    triggerChar="@"
                  />

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={!messageText.trim() || sending}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center"
                  >
                    {sending ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </form>

              {/* Tips */}
              <p className="text-xs text-gray-400">
                💡 Hover on message to see options • Type @ to mention • Right-click for more
              </p>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Select a user to start chatting</p>
          </div>
        )}
      </div>

      {/* Media Viewer Modal */}
      {selectedMedia && (
        <MediaViewer
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      )}
    </div>
  );
}

export default AdvancedChatWithActions;
