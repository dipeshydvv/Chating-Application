import React, { useState, useEffect } from 'react';
import { X, Heart, Smile, MessageCircle, Copy, Pin, Share2, Ban, Zap, Lock, Eye, CheckCheck } from 'lucide-react';

function MessageFeatures({ 
  message, 
  onReaction, 
  onForward, 
  onPin, 
  onBlock, 
  onDelete,
  currentUserId,
  isOwn 
}) {
  const [showReactions, setShowReactions] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [reactions, setReactions] = useState(message.reactions || {});

  const reactionEmojis = ['❤️', '😂', '😮', '😢', '🔥', '👍', '🎉', '😍'];

  const handleReaction = (emoji) => {
    const newReactions = { ...reactions };
    if (!newReactions[emoji]) {
      newReactions[emoji] = [];
    }
    
    if (!newReactions[emoji].includes(currentUserId)) {
      newReactions[emoji].push(currentUserId);
    } else {
      newReactions[emoji] = newReactions[emoji].filter(id => id !== currentUserId);
      if (newReactions[emoji].length === 0) {
        delete newReactions[emoji];
      }
    }
    
    setReactions(newReactions);
    onReaction(message.id, newReactions);
    setShowReactions(false);
  };

  const copyMessage = () => {
    navigator.clipboard.writeText(message.text);
    alert('✅ Message copied!');
  };

  const handleForward = () => {
    onForward(message);
    setShowMenu(false);
  };

  const handlePin = () => {
    onPin(message.id);
    setShowMenu(false);
    alert('📌 Message pinned!');
  };

  const handleBlock = () => {
    if (window.confirm(`Block ${message.senderName}?`)) {
      onBlock(message.senderId);
      setShowMenu(false);
      alert('✅ User blocked!');
    }
  };

  return (
    <div className="relative group">
      {/* Message Reactions Display */}
      {Object.keys(reactions).length > 0 && (
        <div className="flex gap-1 mt-1 flex-wrap">
          {Object.entries(reactions).map(([emoji, users]) => (
            <button
              key={emoji}
              className="text-xs bg-slate-700/50 px-2 py-1 rounded-full hover:bg-slate-600 transition-all"
              title={`Reacted by ${users.length} user${users.length > 1 ? 's' : ''}`}
            >
              {emoji} {users.length > 1 ? users.length : ''}
            </button>
          ))}
        </div>
      )}

      {/* Message Status Indicators */}
      <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
        {message.encrypted && (
          <Lock className="w-3 h-3 text-green-400" title="End-to-end encrypted" />
        )}
        {message.pinned && (
          <Pin className="w-3 h-3 text-yellow-400" title="Pinned message" />
        )}
        {message.forwarded && (
          <Share2 className="w-3 h-3 text-blue-400" title="Forwarded message" />
        )}
        {isOwn && (
          <>
            {message.read ? (
              <CheckCheck className="w-3 h-3 text-blue-400" title="Read" />
            ) : message.delivered ? (
              <CheckCheck className="w-3 h-3 text-gray-400" title="Delivered" />
            ) : (
              <span className="text-gray-500">✓</span>
            )}
          </>
        )}
        {message.viewedBy && message.viewedBy.length > 0 && (
          <Eye className="w-3 h-3 text-green-400" title={`Viewed by ${message.viewedBy.length}`} />
        )}
      </div>

      {/* Action Buttons (Hover Menu) */}
      <div className="absolute bottom-full right-0 mb-2 hidden group-hover:flex gap-1 bg-slate-800 p-2 rounded-lg border border-slate-700 z-10">
        {/* Reaction Button */}
        <div className="relative">
          <button
            onClick={() => setShowReactions(!showReactions)}
            className="p-2 hover:bg-slate-700 rounded transition-all"
            title="Add reaction"
          >
            <Smile className="w-4 h-4 text-gray-400" />
          </button>

          {/* Reaction Picker */}
          {showReactions && (
            <div className="absolute bottom-full right-0 mb-2 bg-slate-800 p-2 rounded-lg border border-slate-700 grid grid-cols-4 gap-1">
              {reactionEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className="text-lg hover:scale-125 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Copy Button */}
        <button
          onClick={copyMessage}
          className="p-2 hover:bg-slate-700 rounded transition-all"
          title="Copy message"
        >
          <Copy className="w-4 h-4 text-gray-400" />
        </button>

        {/* Forward Button */}
        <button
          onClick={handleForward}
          className="p-2 hover:bg-slate-700 rounded transition-all"
          title="Forward message"
        >
          <Share2 className="w-4 h-4 text-gray-400" />
        </button>

        {/* Pin Button */}
        <button
          onClick={handlePin}
          className="p-2 hover:bg-slate-700 rounded transition-all"
          title="Pin message"
        >
          <Pin className="w-4 h-4 text-gray-400" />
        </button>

        {/* More Options */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-slate-700 rounded transition-all"
            title="More options"
          >
            <Zap className="w-4 h-4 text-gray-400" />
          </button>

          {showMenu && (
            <div className="absolute bottom-full right-0 mb-2 bg-slate-800 rounded-lg border border-slate-700 min-w-max">
              {!isOwn && (
                <button
                  onClick={handleBlock}
                  className="w-full text-left px-4 py-2 hover:bg-slate-700 text-red-400 transition-all flex items-center gap-2"
                >
                  <Ban className="w-4 h-4" />
                  Block User
                </button>
              )}
              {isOwn && (
                <button
                  onClick={onDelete}
                  className="w-full text-left px-4 py-2 hover:bg-slate-700 text-red-400 transition-all"
                >
                  Delete Message
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageFeatures;
