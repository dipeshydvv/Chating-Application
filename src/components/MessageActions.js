// Message Actions Component
// Pin, delete, and other message actions with persistent menu

import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Pin, Trash2, Copy, Reply, X } from 'lucide-react';
import axios from 'axios';

function MessageActions({ 
  message, 
  currentUserId, 
  onPin, 
  onDelete, 
  onReply,
  onCopy 
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);
  const menuRef = useRef(null);

  // Backend API URL
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
        setShowDeleteOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle pin message
  const handlePin = async () => {
    try {
      await axios.post(`${API_URL}/messages/${message.id}/pin`, {
        isPinned: !message.isPinned
      }, {
        timeout: 5000
      }).catch(() => {
        // Fallback to localStorage
        const key = `pinned_messages`;
        const pinned = JSON.parse(localStorage.getItem(key) || '[]');
        if (!pinned.includes(message.id)) {
          pinned.push(message.id);
          localStorage.setItem(key, JSON.stringify(pinned));
        }
      });

      if (onPin) {
        onPin(message);
      }
      setShowMenu(false);
    } catch (err) {
      console.error('Error pinning message:', err);
    }
  };

  // Handle delete from me
  const handleDeleteFromMe = async () => {
    try {
      await axios.delete(`${API_URL}/messages/${message.id}`, {
        data: { deleteType: 'me' },
        timeout: 5000
      }).catch(() => {
        // Fallback to localStorage
        const key = `deleted_messages_me`;
        const deleted = JSON.parse(localStorage.getItem(key) || '[]');
        deleted.push(message.id);
        localStorage.setItem(key, JSON.stringify(deleted));
      });

      if (onDelete) {
        onDelete(message.id, 'me');
      }
      setShowMenu(false);
      setShowDeleteOptions(false);
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  // Handle delete from everyone
  const handleDeleteFromEveryone = async () => {
    try {
      await axios.delete(`${API_URL}/messages/${message.id}`, {
        data: { deleteType: 'everyone' },
        timeout: 5000
      }).catch(() => {
        // Fallback to localStorage
        const key = `deleted_messages_everyone`;
        const deleted = JSON.parse(localStorage.getItem(key) || '[]');
        deleted.push(message.id);
        localStorage.setItem(key, JSON.stringify(deleted));
      });

      if (onDelete) {
        onDelete(message.id, 'everyone');
      }
      setShowMenu(false);
      setShowDeleteOptions(false);
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  // Handle copy
  const handleCopy = () => {
    if (message.content) {
      navigator.clipboard.writeText(message.content);
      if (onCopy) {
        onCopy(message);
      }
    }
    setShowMenu(false);
  };

  // Handle reply
  const handleReply = () => {
    if (onReply) {
      onReply(message);
    }
    setShowMenu(false);
  };

  // Check if user is sender
  const isSender = message.senderId === currentUserId;

  return (
    <div ref={menuRef} className="relative">
      {/* Menu Button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-1 hover:bg-gray-600 rounded transition-colors text-gray-400 hover:text-white"
        title="Message options"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {/* Main Menu */}
      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-50 overflow-hidden">
          {/* Reply */}
          <button
            onClick={handleReply}
            className="w-full px-4 py-2 text-left text-gray-200 hover:bg-gray-600 flex items-center gap-2 transition-colors border-b border-gray-600"
          >
            <Reply className="w-4 h-4" />
            Reply
          </button>

          {/* Copy */}
          <button
            onClick={handleCopy}
            className="w-full px-4 py-2 text-left text-gray-200 hover:bg-gray-600 flex items-center gap-2 transition-colors border-b border-gray-600"
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>

          {/* Pin */}
          <button
            onClick={handlePin}
            className="w-full px-4 py-2 text-left text-gray-200 hover:bg-gray-600 flex items-center gap-2 transition-colors border-b border-gray-600"
          >
            <Pin className="w-4 h-4" />
            {message.isPinned ? 'Unpin' : 'Pin'}
          </button>

          {/* Delete (only for sender) */}
          {isSender && (
            <div>
              <button
                onClick={() => setShowDeleteOptions(!showDeleteOptions)}
                className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-600 flex items-center gap-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>

              {/* Delete Submenu */}
              {showDeleteOptions && (
                <div className="bg-gray-800 border-t border-gray-600">
                  <button
                    onClick={handleDeleteFromMe}
                    className="w-full px-4 py-2 text-left text-red-300 hover:bg-gray-700 text-sm transition-colors border-b border-gray-600"
                  >
                    Delete from me
                  </button>
                  <button
                    onClick={handleDeleteFromEveryone}
                    className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 text-sm transition-colors font-semibold"
                  >
                    Delete from everyone
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MessageActions;
